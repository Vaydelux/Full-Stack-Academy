import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Bug Hunt accidental secret commit — policy regression",()=>{const gitTest=()=>{const s=createGitSandbox();try{const {git,write,commitBase}=s;commitBase();write('.env.local','DEMO_FAKE_TOKEN=training_only_not_a_secret\n');git(['add','.env.local']);git(['commit','--quiet','-m','test: accidentally track fake environment']);solve(s);assert.equal(git(['ls-files','.env.local']).stdout.trim(),'');assert.equal(git(['check-ignore','.env.local']).stdout.trim(),'.env.local');assert.equal(s.exists('.env.local'),true);assert.match(git(['show','HEAD~1:.env.local']).stdout,/training_only_not_a_secret/);}finally{s.cleanup();}};gitTest();});
