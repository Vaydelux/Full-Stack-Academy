import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
import {solve} from './'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs';
test("Gitignore and secrets — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();write('.env.local','FAKE_TRAINING_VALUE=DEMO_ONLY_NOT_A_SECRET\n');
solve(sandbox);
assert.equal(git(['check-ignore','.env.local']).stdout.trim(),'.env.local');assert.equal(git(['ls-files','.env.local']).stdout.trim(),'');assert.equal(git(['show','HEAD:.gitignore']).stdout.includes('.env.local'),true);
}finally{sandbox.cleanup();}
});
