import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.02 Components and props: valid and edge cases",()=>{
const a=renderToStaticMarkup(createElement(mod.Badge,{name:'Mira',role:'Frontend'}));
assert.match(a,/<h2>Mira<\/h2>/);assert.match(a,/Frontend/);assert.match(a,/aria-label="Team member"/);
const b=renderToStaticMarkup(createElement(mod.Badge,{name:'<script>x<\/script>',role:'QA'}));
assert.doesNotMatch(b,/<script>/);assert.match(b,/&lt;script&gt;/);
});
