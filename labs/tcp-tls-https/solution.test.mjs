import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
import { connect } from 'node:net';
import { once } from 'node:events';
test('real loopback TCP exchanges bytes',async()=>{const server=api.createGreetingServer().listen(0,'127.0.0.1');await once(server,'listening');try{const socket=connect(server.address().port,'127.0.0.1');let result='';for await(const chunk of socket)result+=chunk.toString();assert.equal(result,'hello transport');}finally{await new Promise(resolve=>server.close(resolve));}});
test('URL describes transport and default ports',()=>{assert.deepEqual(api.transportInfo('https://api.example.com'),{host:'api.example.com',port:443,encrypted:true});assert.equal(api.transportInfo('http://localhost:3100').port,3100);assert.throws(()=>api.transportInfo('ftp://example.com'));});
test('hostname matches only covered names',()=>{assert.deepEqual(api.verifyIdentity('api.example.com','DNS:api.example.com'),{ok:true});assert.equal(api.verifyIdentity('admin.example.com','DNS:api.example.com').ok,false);});
