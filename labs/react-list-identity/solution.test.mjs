import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const target=process.env.ACADEMY_LAB_TARGET==='starter' ? 'starter' : 'solution';
const mod=await import('./'+target+'/solution.tsx');
test("06.01.05 Lists, keys and identity: valid and edge cases",()=>{
const tasks=[{id:'t2',title:'Review'},{id:'t1',title:'Plan'}];
const html=renderToStaticMarkup(createElement(mod.TaskList,{tasks}));
assert.ok(html.indexOf('Review')<html.indexOf('Plan'));assert.match(html,/data-id="t2"/);
const tree=mod.TaskList({tasks});assert.deepEqual(tree.props.children.map((child)=>child.key),['t2','t1']);
assert.match(renderToStaticMarkup(createElement(mod.TaskList,{tasks:[]})),/role="status".*No tasks/);
});
