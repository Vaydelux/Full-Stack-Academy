import test from 'node:test';
import assert from 'node:assert/strict';
import { modulePlan, qualifyModule } from '../scripts/module-qualification.mjs';
const setup=['test:source-coverage','require-lock','install','typecheck','build'];
test('architecture and pipeline require real build and their own runtime suite',()=>{
  assert.deepEqual(modulePlan('11.01'),[...setup,'test:architecture']);
  assert.deepEqual(modulePlan('11.02'),[...setup,'test:pipeline']);
});
test('domain and advanced retain their distinct live-service gates',()=>{
  assert.deepEqual(modulePlan('11.03'),[...setup,'test:domain','test:integration:pg']);
  assert.deepEqual(modulePlan('11.04'),[...setup,'test:advanced','test:integration:sockets']);
});
test('unknown and inherited keys cannot select arbitrary scripts',()=>{
  for(const value of ['11.05','constructor','__proto__','npm run publish'])assert.throws(()=>modulePlan(value),/Unknown NestJS module/);
});
test('lock failure prevents dependency installation and runtime claims',()=>{
  const called=[];const result=qualifyModule('11.03',step=>{called.push(step);return {status:step==='require-lock'?2:0};});
  assert.deepEqual(called,setup.slice(0,2));assert.equal(result.status,'failed');assert.equal(result.publicationApproved,false);
});
test('nonzero, signal and spawn failures stop immediately',()=>{
  for(const failure of [{status:1},{status:null,signal:'SIGTERM'},{status:0,error:Error('spawn')}]){
    const result=qualifyModule('11.01',()=>failure);assert.equal(result.results.length,1);assert.equal(result.status,'failed');
  }
});
test('a successful mocked execution never grants publication approval',()=>{
  const called=[];const result=qualifyModule('11.04',step=>{called.push(step);return {status:0};});
  assert.deepEqual(called,modulePlan('11.04'));assert.equal(result.status,'runtime-passed');assert.equal(result.publicationApproved,false);
});
