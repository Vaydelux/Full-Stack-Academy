import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("06.05.08 Bug Hunt unstable keys source-level and SSR checks",()=>{
const issues=[{id:'z',title:'Fix focus'},{id:'a',title:'Fix cache'}];
const tree=mod.IssueBoard({issues});assert.deepEqual(tree.props.children.map(item=>item.key),['z','a']);
assert.match(renderToStaticMarkup(createElement(mod.IssueBoard,{issues:[]})),/No issues/);
const swapped=mod.IssueBoard({issues:[...issues].reverse()});assert.deepEqual(swapped.props.children.map(item=>item.key),['a','z']);
});
