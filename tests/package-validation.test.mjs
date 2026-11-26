import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {runPackageValidation} from '../scripts/run-package-validation.mjs';
const root=path.resolve('fixture');
const fake=(responses)=>{const calls=[];return {calls,spawn:(cmd,args,opts)=>{calls.push({cmd,args,opts});assert.ok(responses.length,'unexpected invocation');return responses.shift();}};};
const ok={status:0},missing={error:{code:'ENOENT'}};
test('POSIX prefers Python 3 and protects assertion execution',()=>{
 const f=fake([ok,ok]);runPackageValidation({...f,platform:'linux',root});
 assert.deepEqual(f.calls.map(c=>c.cmd),['python3','python3']);
 assert.equal(f.calls[1].args[0],'-I');
 assert.equal(f.calls[1].args[1],path.join(root,'validate_package.py'));
 assert.ok(f.calls.every(c=>c.opts.shell===false));
 assert.match(f.calls[0].args.at(-1),/sys.flags.optimize == 0/);
});
test('Windows uses the Python launcher with explicit major version',()=>{
 const f=fake([ok,ok]);runPackageValidation({...f,platform:'win32',root});
 assert.deepEqual(f.calls[1].args.slice(0,2),['-3','-I']);
 assert.equal(f.calls[1].cmd,'py');
});
test('missing primary executable falls back to another verified Python 3',()=>{
 const f=fake([missing,ok,ok]);runPackageValidation({...f,platform:'linux',root});
 assert.deepEqual(f.calls.map(c=>c.cmd),['python3','python','python']);
});
test('a failed validator cannot be bypassed by a fallback interpreter',()=>{
 const f=fake([ok,{status:1}]);assert.throws(()=>runPackageValidation({...f,platform:'linux',root}),/validation failed/);
 assert.equal(f.calls.length,2);
});
test('missing or incompatible Python fails closed',()=>{
 const f=fake([missing,{status:1}]);assert.throws(()=>runPackageValidation({...f,platform:'linux',root}),/Python 3 is required/);
});
test('signal and spawn errors after selection fail closed',()=>{
 for(const result of [{signal:'SIGTERM',status:null},{error:{message:'timeout'}}]){
  const f=fake([ok,result]);assert.throws(()=>runPackageValidation({...f,platform:'linux',root}),/validation failed/);
  assert.equal(f.calls.length,2);
 }
});
