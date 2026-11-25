import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {WebSocketServer,WebSocket} from 'ws';
const origin='http://academy.test';
export function websocketLab({sessionMs=60000,now=Date.now}={}){
 const tokens=Object.fromEntries(['alpha','beta'].map(t=>[t,randomBytes(32).toString('hex')])),sessions=new Map(Object.entries(tokens).map(([tenant,token])=>[token,{tenant,expires:now()+sessionMs}]));
 const peers=new Map(),server=createServer((_req,res)=>{res.writeHead(404);res.end();}),wss=new WebSocketServer({noServer:true,maxPayload:1024,perMessageDeflate:false});
 const reject=(socket,status)=>{socket.end('HTTP/1.1 '+status+'\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');};
 const allowed=(token,tenant)=>{const s=sessions.get(token);return s&&s.tenant===tenant&&s.expires>now();};
 server.on('upgrade',(req,socket,head)=>{
  socket.on('error',()=>socket.destroy());
  let u;try{u=new URL(req.url,'http://127.0.0.1');}catch{return reject(socket,'400 Bad Request');}
  if(u.pathname!=='/socket'||req.headers.origin!==origin)return reject(socket,'403 Forbidden');
  const token=req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1],tenant=u.searchParams.get('tenant');
  if(!token||!sessions.has(token)||sessions.get(token).expires<=now())return reject(socket,'401 Unauthorized');
  if(!allowed(token,tenant))return reject(socket,'404 Not Found');
  if(peers.size>=8)return reject(socket,'429 Too Many Requests');
  wss.handleUpgrade(req,socket,head,ws=>{
   peers.set(ws,{token,tenant,alive:true});ws.on('error',()=>ws.terminate());ws.on('close',()=>peers.delete(ws));ws.on('pong',()=>{const p=peers.get(ws);if(p)p.alive=true;});
   ws.on('message',(raw,binary)=>{
    if(!allowed(token,tenant)){ws.close(1008,'unauthorized');return;}
    let data;try{if(binary)throw Error();data=JSON.parse(raw.toString());if(!data||Object.keys(data).length!==1||typeof data.message!=='string'||data.message.length>256||!data.message.length)throw Error();}catch{ws.close(1008,'invalid message');return;}
    const frame=JSON.stringify({message:data.message});
    for(const [target,p] of peers)if(p.tenant===tenant){if(!allowed(p.token,p.tenant)||target.bufferedAmount>8192){target.terminate();continue;}if(target.readyState===WebSocket.OPEN)target.send(frame);}
   });
  });
 });
 const timer=setInterval(()=>{for(const [ws,p] of peers){if(!allowed(p.token,p.tenant)||!p.alive){ws.terminate();continue;}p.alive=false;ws.ping();}},1000);timer.unref();
 function revoke(token){sessions.delete(token);for(const [ws,p] of peers)if(p.token===token)ws.close(1008,'revoked');}
 async function close(){clearInterval(timer);for(const ws of peers.keys())ws.terminate();await new Promise(r=>wss.close(r));server.closeAllConnections();await new Promise((r,j)=>server.close(e=>e?j(e):r()));}
 return {server,tokens,origin,revoke,close};
}
