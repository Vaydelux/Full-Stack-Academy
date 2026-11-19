import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.06: useActionState and form validation local acceptance",async ()=>{
const blank=new FormData();blank.set('feedback',' ');const short=new FormData();short.set('feedback','ab');
const good=new FormData();good.set('feedback','Detailed note');
assert.deepEqual(await mod.checkFeedback({ok:false,message:''},blank),{ok:false,message:'Enter at least 3 characters'});
assert.equal((await mod.checkFeedback({ok:false,message:''},short)).ok,false);
assert.equal((await mod.checkFeedback({ok:false,message:''},good)).ok,true);
assert.equal(typeof mod.FeedbackForm,'function');
});
