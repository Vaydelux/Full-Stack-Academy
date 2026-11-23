import test from 'node:test';
import assert from 'node:assert/strict';
import {runQualification,stages} from './evidence.mjs';
const validEnv={P5_LAB_CONFIRM:'DISPOSABLE_ONLY',P5_HTTP_DB_CONFIRM:'ISOLATED_CLUSTER',P5_LAB_DATABASE_URL:'postgresql://fixture:secret@127.0.0.1:5432/p5_lab_security'};
const commit='a'.repeat(40);
const mock=(opts={})=>{
 const calls=[];
 const run=(cmd,args,options)=>{
  calls.push({cmd,args,options});
  if(cmd==='git')return {status:0,stdout:args.includes('rev-parse')?commit:''};
  if(cmd==='psql')return {status:0,stdout:opts.serverVersion||'170012\n'};
  if(cmd==='npm'){
   const id=args[1],stage=stages.find(x=>x.command===id);
   const status=opts.fail===id?1:0;
   const stdout=opts.omitMarker===id?'test output':(stage.marker||'all tests green')+'\n';
   return {status,stdout,stderr:''};
  }
  return {error:new Error('Unexpected executable '+cmd)};
 };
 return {run,calls};
};
test('requires real Node 24',()=>assert.equal(runQualification({version:'v22.16.0',env:validEnv}).passed,false));
test('rejects absent disposable target confirmations',()=>assert.equal(runQualification({version:'v24.0.0',env:{}}).passed,false));
test('accepts all four ordered stages with Git SHA and PostgreSQL version',()=>{
 const m=mock();const report=runQualification({version:'v24.3.0',env:validEnv,run:m.run});
 assert.equal(report.passed,true);assert.equal(report.stages.length,4);
 assert.equal(report.commit,commit);assert.equal(report.postgresServerVersion,170012);
 assert.deepEqual(report.stages.map(x=>x.name),stages.map(x=>x.command));
 assert.ok(report.stages.every(x=>/^[a-f0-9]{64}$/.test(x.logSha256)));
 assert.ok(!JSON.stringify(report).includes('secret'));
 assert.ok(!m.calls.find(x=>x.cmd==='psql').args.some(x=>x.includes('secret')));
});
test('rejects SQL stage success without the real marker',()=>{
 const m=mock({omitMarker:'qualify:p5:rls'});
 const report=runQualification({version:'v24.3.0',env:validEnv,run:m.run});
 assert.equal(report.passed,false);assert.equal(report.stages.length,3);
 assert.equal(report.stages[2].markerPresent,false);
});
test('stops after first failing stage',()=>{
 const m=mock({fail:'qualify:p5:postgresql'});
 const report=runQualification({version:'v24.3.0',env:validEnv,run:m.run});
 assert.equal(report.passed,false);assert.equal(report.stages.length,2);
 assert.equal(m.calls.filter(x=>x.cmd==='npm').length,2);
});
test('server version below 17 fails before tests',()=>{
 const m=mock({serverVersion:'160004'});
 const report=runQualification({version:'v24.0.0',env:validEnv,run:m.run});
 assert.equal(report.passed,false);assert.equal(m.calls.filter(x=>x.cmd==='npm').length,0);
});
test('all DB values passed as protected environment, not command-line secrets',()=>{
 const m=mock();runQualification({version:'v24.2.0',env:validEnv,run:m.run});
 for(const call of m.calls){assert.equal(call.options.env.PGPASSWORD,'secret');assert.ok(!call.args.some(x=>x.includes('secret')));}
});
test('evidence runner rejects unsafe remote URL',()=>{
 const m=mock();const report=runQualification({version:'v24.2.0',env:{...validEnv,P5_LAB_DATABASE_URL:'postgresql://fixture@evil.com/p5_lab_security'},run:m.run});
 assert.equal(report.passed,false);assert.equal(m.calls.length,0);
});
