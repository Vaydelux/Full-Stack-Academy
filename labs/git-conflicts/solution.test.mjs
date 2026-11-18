import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitSandbox} from '../git-sandbox/harness.mjs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Resolve merge conflicts — real local Git history contract",()=>{
const sandbox=createGitSandbox();
try{const {git,write,read,bareRemote,commitBase}=sandbox;
commitBase();write('message.txt','Base line\n');git(['add','message.txt']);git(['commit','--quiet','-m','docs: baseline']);git(['switch','-c','feature']);write('message.txt','Base line\nFeature note\n');git(['add','message.txt']);git(['commit','--quiet','-m','docs: feature note']);git(['switch','main']);write('message.txt','Base line\nMain note\n');git(['add','message.txt']);git(['commit','--quiet','-m','docs: main note']);
solve(sandbox);
assert.equal(read('message.txt'),'Base line\nMain note\nFeature note\n');assert.equal(git(['status','--porcelain']).stdout.trim(),'');assert.equal(git(['rev-list','--parents','-n','1','HEAD']).stdout.trim().split(' ').length,3);
}finally{sandbox.cleanup();}
});
