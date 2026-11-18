import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Reset restore and revert — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();write('settings.txt','safe\n');git(['add','settings.txt']);git(['commit','--quiet','-m','feat: safe settings']);write('settings.txt','broken\n');git(['add','settings.txt']);git(['commit','--quiet','-m','fix: accidentally break settings']);
solve(sandbox);
assert.equal(read('settings.txt'),'safe\n');assert.equal(git(['rev-list','--count','HEAD']).stdout.trim(),'4');assert.match(git(['log','-1','--pretty=%s']).stdout,/Revert/);
}finally{sandbox.cleanup();}
});
