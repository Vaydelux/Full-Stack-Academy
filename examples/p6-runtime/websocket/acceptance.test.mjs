import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
import {websocketLab} from './server.mjs';
test('real ws upgrades, tenant-scoped fanout, origin rejection, invalid message and revocation',{timeout:15000},async t=>{
 const lab=websocketLab();lab.server.listen(0,'127.0.0.1');await once(lab.server,'listening');const base='ws://127.0.0.1:'+lab.server.address().port+'/socket?tenant=';
 const clients=[];t.after(async()=>{for(const c of clients)c.terminate();await lab.close();});
 const connect=(tenant,token,origin=lab.origin)=>{const c=new WebSocket(base+tenant,{origin,headers:{Authorization:'Bearer '+token},handshakeTimeout:3000});clients.push(c);c.on('error',()=>{});return c;};
 const deny=async(c,status)=>{const [req,res]=await once(c,'unexpected-response');assert.equal(res.statusCode,status);res.resume();req.destroy();};
 await deny(connect('alpha',lab.tokens.beta),404);await deny(connect('alpha',lab.tokens.alpha,'http://foreign.test'),403);
 const a=connect('alpha',lab.tokens.alpha),a2=connect('alpha',lab.tokens.alpha),b=connect('beta',lab.tokens.beta);
 await Promise.all([a,a2,b].map(c=>once(c,'open')));
 let foreign=0;b.on('message',()=>foreign++);const received=once(a2,'message');a.send(JSON.stringify({message:'hello'}));assert.deepEqual(JSON.parse((await received)[0]),{message:'hello'});
 const own=once(b,'message');b.send(JSON.stringify({message:'own'}));assert.deepEqual(JSON.parse((await own)[0]),{message:'own'});await delay(100);assert.equal(foreign,1);
 const invalid=once(a,'close');a.send(JSON.stringify({message:'x',tenant:'beta'}));assert.equal((await invalid)[0],1008);
 const revoked=once(a2,'close');lab.revoke(lab.tokens.alpha);assert.equal((await revoked)[0],1008);await deny(connect('alpha',lab.tokens.alpha),401);
});
