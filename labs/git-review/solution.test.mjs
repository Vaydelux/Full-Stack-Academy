import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Pull requests and code review — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();
solve(sandbox);
assert.match(git(['diff','--name-only','main...feature/docs']).stdout,/note\.md/);assert.match(git(['show','HEAD:REVIEW.md']).stdout,/Reviewer question/);assert.equal(git(['diff','--check','main...feature/docs']).status,0);
}finally{sandbox.cleanup();}
});
