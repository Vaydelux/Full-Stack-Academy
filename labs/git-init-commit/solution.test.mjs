import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("init clone status add commit — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
write('lesson.txt','Commit this learning note.\n');
solve(sandbox);
assert.equal(git(['show','HEAD:lesson.txt']).stdout,'Commit this learning note.\n');assert.equal(git(['status','--porcelain']).stdout.trim(),'');
}finally{sandbox.cleanup();}
});
