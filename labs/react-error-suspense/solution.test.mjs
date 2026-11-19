import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.04.07: Error boundaries and Suspense local acceptance",()=>{
const html=renderToStaticMarkup(createElement(mod.RescueBoundary,null,createElement('p',null,'Ready')));
assert.match(html,/Ready/);assert.deepEqual(mod.RescueBoundary.getDerivedStateFromError(new Error('fail')),{failed:true});
const boundary=new mod.RescueBoundary({children:createElement('p',null,'Ready')});
boundary.state={failed:true};const failed=renderToStaticMarkup(boundary.render());
assert.match(failed,/role="alert".*Cannot show/);
assert.match(renderToStaticMarkup(createElement(mod.LoadingSection,null,createElement('p',null,'Loaded'))),/Loaded/);
});
