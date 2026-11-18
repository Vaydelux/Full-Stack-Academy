import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Remote repositories and push — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();const remote=bareRemote();
solve({...sandbox,remote});
const remoteCheck=git(['ls-remote','origin','refs/heads/main']).stdout;assert.match(remoteCheck,/refs\/heads\/main/);assert.match(git(['rev-parse','--abbrev-ref','main@{upstream}']).stdout,/origin\/main/);
}finally{sandbox.cleanup();}
});
