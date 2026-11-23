// Real localhost SSE transport with synthetic test sessions; not deployable auth.
import {createServer} from 'node:http';
import {createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {ReplayGapError} from './feed.mjs';
const origin = 'http://academy.test';
const json = (res, code, payload) => {res.writeHead(code, {'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(payload));};
const signature = (body, secret) => createHmac('sha256',secret).update(body).digest('base64url');
const safeId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,48}$/.test(value);
function decodeSession(token, secret, now) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.'); if (parts.length !== 2) return null;
  const expected = Buffer.from(signature(parts[0],secret)), actual = Buffer.from(parts[1]);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const value = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    return safeId(value.actor) && Number.isFinite(value.exp) && value.exp > now() ? value.actor : null;
  } catch {return null;}
}
function cursor(req) {
  const value = req.headers['last-event-id'];
  if (value === undefined || value === '') return 0;
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]{0,14})$/.test(value)) return null;
  const n = Number(value); return Number.isSafeInteger(n) ? n : null;
}
const eventFrame = event => `id: ${event.id}\nevent: ${event.kind}\ndata: ${JSON.stringify(event.payload)}\n\n`;
async function body(req) {
  const parts=[];let size=0;
  for await (const chunk of req) {size+=chunk.length; if (size>8192) throw Object.assign(Error('too_large'),{status:413});parts.push(chunk);}
  try {const obj=JSON.parse(Buffer.concat(parts).toString('utf8'));if(!obj||Array.isArray(obj)||typeof obj!=='object')throw Error();return obj;}
  catch {throw Object.assign(Error('bad_json'),{status:400});}
}
export function makeSseLab(hub,{now=Date.now,secret=randomBytes(32)}={}) {
  const revoked = new Set();
  const streams = new Map();
  function session(actor,ttl=120_000) {
    if (!safeId(actor)) throw new Error('Unknown synthetic actor');
    const payload=Buffer.from(JSON.stringify({actor,exp:now()+ttl,nonce:randomBytes(12).toString('hex')})).toString('base64url');
    return payload+'.'+signature(payload,secret);
  }
  const server=createServer(async(req,res)=>{
    const path=new URL(req.url||'/', 'http://localhost');
    if(req.method==='GET' && path.pathname==='/health')return json(res,200,{ok:true});
    const bearer=(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];
    const actor=revoked.has(bearer)?null:decodeSession(bearer,secret,now);
    if(!actor)return json(res,401,{error:'unauthenticated'});
    const tenantId=path.searchParams.get('tenant');
    try {
      if(req.method==='GET'&&path.pathname==='/events') {
        const lastId=cursor(req);if(lastId===null)return json(res,400,{error:'invalid_cursor'});
        if(!safeId(tenantId))return json(res,400,{error:'invalid_tenant'});
        let unsubscribe;
        // Defer headers until authorization, cursor validation and replay complete.
        const pending=[];
        unsubscribe=hub.subscribe({actor,tenantId,lastId,onEvent:e=>{if(res.headersSent)res.write(eventFrame(e));else pending.push(e);},onClose:()=>res.end()});
        res.writeHead(200,{'content-type':'text/event-stream; charset=utf-8','cache-control':'no-store','connection':'keep-alive','x-accel-buffering':'no'});
        res.write(': connected\n\n'); for(const e of pending)res.write(eventFrame(e));
        if(!streams.has(bearer))streams.set(bearer,new Set());streams.get(bearer).add(res);
        res.on('close',()=>{unsubscribe();streams.get(bearer)?.delete(res);if(streams.get(bearer)?.size===0)streams.delete(bearer);});
        return;
      }
      if(req.method==='POST'&&path.pathname==='/events') {
        if(req.headers.origin!==origin)return json(res,403,{error:'invalid_origin'});
        const input=await body(req);
        if(!safeId(input.tenantId)||!safeId(input.kind)||typeof input.message!=='string'||input.message.length<1||input.message.length>240)
          return json(res,400,{error:'invalid_event'});
        const event=hub.publish({actor,tenantId:input.tenantId,kind:input.kind,payload:{message:input.message}});
        return json(res,201,event);
      }
      if(req.method==='POST'&&path.pathname==='/logout') {
        if(req.headers.origin!==origin)return json(res,403,{error:'invalid_origin'});
        revoked.add(bearer);
        for(const active of streams.get(bearer)||[])active.end();
        streams.delete(bearer);
        return json(res,200,{loggedOut:true});
      }
      return json(res,404,{error:'not_found'});
    }catch(err){
      if(err instanceof ReplayGapError)return json(res,409,{error:'snapshot_required'});
      if(err.message==='forbidden')return json(res,404,{error:'not_found'});
      if(err.message==='subscriber_limit')return json(res,429,{error:'subscriber_limit'});
      if(err instanceof RangeError)return json(res,400,{error:'invalid_cursor'});
      return json(res,err.status||500,{error:err.status===400?'invalid_json':err.status===413?'body_too_large':'internal_error'});
    }
  });
  return {server,session,origin};
}
