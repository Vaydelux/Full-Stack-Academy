import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyRedGreen } from '../scripts/red-green.mjs';
import { NestFactory, ContextIdFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const load = (slug,variant) => import('../dist/'+slug+'/'+variant+'.js');
const checkBoth = (slug, probe, expectedFailure) => verifyRedGreen(load, slug, probe, expectedFailure);
async function appResponse(rootModule,endpoint) {
  const app=await NestFactory.create(rootModule,new FastifyAdapter(),{logger:false});
  try {
    await app.listen(0,'127.0.0.1');
    const origin=await app.getUrl();
    const response=await fetch(origin+endpoint);
    return {status:response.status,body:await response.json()};
  } finally {await app.close();}
}

test('11.01.01 root module imports the feature route',async()=>{
 await checkBoth('bootstrap-module-graph',async mod=>{
  const r=await appResponse(mod.AppModule,'/tasks');
  assert.equal(r.status,200);
  assert.equal(r.body[0].id,'t1');
 });
});
test('11.01.02 route segment and Param key match',async()=>{
 await checkBoth('controllers-routing',async mod=>{
  class Root {}
  Module({controllers:[mod.TasksController]})(Root);
  const good=await appResponse(Root,'/tasks/t1');
  assert.equal(good.status,200);
  assert.equal(good.body.id,'t1');
  const missing=await appResponse(Root,'/tasks/unknown');
  assert.equal(missing.status,404);
 });
});
test('11.01.03 the controller uses an injectable and overridable provider',async()=>{
 await checkBoth('injectable-providers',async mod=>{
  const fixture=Test.createTestingModule({imports:[mod.TasksModule]});
  const container=await fixture.overrideProvider(mod.TasksService).useValue({count:()=>7}).compile();
  try {assert.equal(container.get(mod.TasksController).count().count,7);}
  finally {await container.close();}
 });
});
test('11.01.04 request-scoped identity does not leak between contexts',async()=>{
 await checkBoth('dependency-injection-scopes',async mod=>{
  const container=await Test.createTestingModule({providers:[mod.RequestIdentity]}).compile();
  try {
   const a=ContextIdFactory.create(),b=ContextIdFactory.create();
   container.registerRequestByContextId({headers:{'x-request-id':'request-a'}},a);
   container.registerRequestByContextId({headers:{'x-request-id':'request-b'}},b);
   const first=await container.resolve(mod.RequestIdentity,a);
   const second=await container.resolve(mod.RequestIdentity,b);
   assert.equal(first.current(),'request-a');
   assert.equal(second.current(),'request-b');
  } finally {await container.close();}
 });
});
test('11.01.05 environment parsing rejects invalid ports',async()=>{
 await checkBoth('config-env-validation',async mod=>{
  assert.equal(mod.parsePort('3337'),3337);
  assert.throws(()=>mod.parsePort('abc'));
  assert.throws(()=>mod.parsePort('70000'));
 });
});
test('11.01.06 Fastify is the actual HTTP adapter',async()=>{
 await checkBoth('fastify-adapter',async mod=>{
  const app=await mod.createApp();
  try {
   await app.init();
   assert.equal(app.getHttpAdapter().getType(),'fastify');
  } finally {await app.close();}
 });
});
test('11.01.07 OnModuleDestroy releases a live timer',async()=>{
 await checkBoth('lifecycle-hooks',async mod=>{
  const container=await Test.createTestingModule({providers:[mod.Poller]}).compile();
  const poller=container.get(mod.Poller);
  try {
   await container.init();
   assert.notEqual(poller.timer,undefined);
   await container.close();
   assert.equal(poller.timer,undefined);
  } finally {
   if(poller.timer)clearInterval(poller.timer);
   await container.close();
  }
 });
});
test('11.01.08 readiness returns HTTP 503 before confirmation',async()=>{
 await checkBoth('hello-api-capstone',async mod=>{
  class Root {}
  Module({providers:[mod.Readiness],controllers:[mod.HealthController]})(Root);
  const app=await NestFactory.create(Root,new FastifyAdapter(),{logger:false});
  try {
   await app.listen(0,'127.0.0.1');
    const origin=await app.getUrl();
   const before=await fetch(origin+'/health');
   assert.equal(before.status,503);
   app.get(mod.Readiness).ready=true;
   const after=await fetch(origin+'/health');
   assert.equal(after.status,200);
  } finally {await app.close();}
 });
});
