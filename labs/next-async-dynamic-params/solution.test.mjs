import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.03 Dynamic route params offline data contract",async ()=>{
assert.equal(await mod.readGuideSlug(Promise.resolve({slug:'app-router'})),'app-router');
await assert.rejects(()=>mod.readGuideSlug(Promise.resolve({slug:'../oops'})),/Invalid guide slug/);
await assert.rejects(()=>mod.readGuideSlug(Promise.resolve({slug:''})),/Invalid guide slug/);
});
