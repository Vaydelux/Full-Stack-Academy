import assert from 'node:assert/strict';
export function makeApi(config,fetcher=fetch){
 const origin=new URL(config.origin);assert.ok(origin.protocol==='http:'&&['127.0.0.1','[::1]'].includes(origin.hostname)&&origin.port,'Invalid local origin');
 async function request(path,{method='GET',token,body,headers={}}={}){
  assert.ok(/^\/(auth|rest|storage)\/v1\//.test(path),'Unsupported API path');
  const url=new URL(path,origin);assert.equal(url.origin,origin.origin);assert.match(url.pathname,/^\/(auth|rest|storage)\/v1\//);
  const h=new Headers(headers);h.set('apikey',config.key);if(token)h.set('Authorization','Bearer '+token);else h.delete('Authorization');
  if(body!==undefined&&!h.has('Content-Type'))h.set('Content-Type','application/json');
  const res=await fetcher(url,{method,headers:h,body:body===undefined?undefined:typeof body==='string'?body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(15000)});
  return res;
 }
 async function login(user){
  const res=await request('/auth/v1/token?grant_type=password',{method:'POST',body:user});assert.equal(res.status,200,'Test login failed');
  const data=await res.json();assert.ok(typeof data.access_token==='string'&&data.access_token.length>20,'Missing access token');
  const check=await request('/auth/v1/user',{token:data.access_token});assert.equal(check.status,200,'Server user verification failed');const verified=await check.json();assert.match(verified.id,/^[a-f0-9-]{36}$/i);assert.equal(verified.email.toLowerCase(),user.email.toLowerCase());assert.equal(verified.id,data.user.id);
  return {id:verified.id,token:data.access_token};
 }
 return {request,login};
}
export function assertDenied(response){assert.ok([401,403].includes(response.status),'Expected authorization denial');}
export async function assertRows(response,expected){assert.equal(response.status,200,'Query failed');assert.deepEqual(await response.json(),expected);}
