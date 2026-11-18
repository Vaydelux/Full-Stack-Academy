import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const api=await import(`./${target}/exercise.mjs`);
test('URL separates hostname and route',()=>{assert.deepEqual(api.inspect('https://example.com:8443/projects?q=1'),{hostname:'example.com',protocol:'https:',port:'8443',path:'/projects'});assert.equal(api.inspect('http://localhost/').port,'80');assert.throws(()=>api.inspect('file:///tmp/file'));});
test('lookup returns all addresses with family',async()=>{const records=[{address:'127.0.0.1',family:4},{address:'::1',family:6}];assert.deepEqual(await api.resolveHost('localhost',async(host,opts)=>{assert.equal(host,'localhost');assert.deepEqual(opts,{all:true});return records;}),records);});
test('diagnostics preserve lookup error category',async()=>{assert.deepEqual(await api.diagnose('missing.invalid',async()=>{throw Object.assign(new Error('missing'),{code:'ENOTFOUND'});}),{ok:false,reason:'name-not-found'});assert.deepEqual(await api.diagnose('example.com',async()=>{throw new Error('other');}),{ok:false,reason:'lookup-failed'});});
