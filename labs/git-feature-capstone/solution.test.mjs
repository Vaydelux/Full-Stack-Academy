import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lab tracked feature change — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();
solve(sandbox);
assert.equal(git(['branch','--show-current']).stdout.trim(),'main');assert.equal(read('feature.md'),'Implemented\n');assert.equal(git(['status','--porcelain']).stdout.trim(),'');assert.match(git(['log','-1','--pretty=%s']).stdout,/reviewed offline feature/);
}finally{sandbox.cleanup();}
});
