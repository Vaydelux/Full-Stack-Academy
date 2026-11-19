import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.06 Suspense streaming: offline boundary contract",()=>{
assert.match(renderToStaticMarkup(createElement(mod.ResourceNotice,{state:'pending'})),/role="status"/);
assert.match(renderToStaticMarkup(createElement(mod.ResourceNotice,{state:'error'})),/role="alert"/);
assert.match(renderToStaticMarkup(createElement(mod.ResourceNotice,{state:'ready'})),/Recommendations ready/);
});
