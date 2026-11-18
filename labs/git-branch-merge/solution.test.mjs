import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Branches merge and rebase — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();
solve(sandbox);
assert.equal(git(['branch','--show-current']).stdout.trim(),'main');assert.equal(git(['show','HEAD:feature.txt']).stdout,'Ready\n');assert.match(git(['log','-1','--pretty=%s']).stdout,/merge: feature ui/);
}finally{sandbox.cleanup();}
});
