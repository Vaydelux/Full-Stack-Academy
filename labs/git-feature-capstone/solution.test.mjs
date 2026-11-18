import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
import {solve} from './'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs';
test("Lab tracked feature change — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();
solve(sandbox);
assert.equal(git(['branch','--show-current']).stdout.trim(),'main');assert.equal(read('feature.md'),'Implemented\n');assert.equal(git(['status','--porcelain']).stdout.trim(),'');assert.match(git(['log','-1','--pretty=%s']).stdout,/reviewed offline feature/);
}finally{sandbox.cleanup();}
});
