import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.08 Profile dashboard card capstone: valid and edge cases",()=>{
const profile={id:'p1',name:'Ava',role:'Engineer',online:false,skills:[{id:'ts',label:'TypeScript'},{id:'css',label:'CSS'}]};
const html=renderToStaticMarkup(createElement(mod.ProfileDashboard,{profile}));
assert.match(html,/aria-label="Profile of Ava"/);assert.match(html,/<h2>Ava<\/h2>/);assert.match(html,/Offline/);
assert.ok(html.indexOf('TypeScript')<html.indexOf('CSS'));assert.match(html,/data-id="ts"/);
assert.match(renderToStaticMarkup(createElement(mod.ProfileDashboard,{profile:{...profile,skills:[]}})),/No skills listed/);
});
