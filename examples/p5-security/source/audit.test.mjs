import test from 'node:test';
import assert from 'node:assert/strict';
import {audit} from './audit.mjs';
const topics=Array.from({length:4},(_,m)=>Array.from({length:8},(_,i)=>({id:'15.0'+(m+1)+'.'+String(i+1).padStart(2,'0'),moduleId:'15.0'+(m+1),title:'Lesson '+(m+1)+' '+(i+1)}))).flat();
const catalog={lessons:topics};
function article(t){return '---\nid: "'+t.id+'"\ntitle: "'+t.title+'"\nmodule: "'+t.moduleId+'"\nstatus: "draft-unverified"\n---\n## Step 1\nGuide\n## Step 2\nGuide\n## Step 3\nGuide\n## Knowledge check\nQuestion\nhttps://owasp.org/';}
const files=Object.fromEntries(topics.map(t=>[t.id,article(t)]));
const execute=(overrides={},registry='')=>audit({catalog,registry,load:id=>overrides[id]??files[id]});
test('accepts canonical 32-module synthetic fixture',()=>assert.equal(execute().ok,true));
test('rejects missing article',()=>assert.ok(audit({catalog,load:id=>{if(id===topics[0].id)throw Error('missing');return files[id]}}).errors.some(e=>e.includes('missing'))));
test('rejects changed title',()=>{const id=topics[0].id;assert.ok(execute({[id]:files[id].replace('title: "Lesson 1 1"','title: "Wrong"')}).errors.some(e=>e.includes('title')))});
test('rejects premature publish flag',()=>{const id=topics[0].id;assert.ok(execute({[id]:files[id]+'\nreadyToPublish: true'}).errors.some(e=>e.includes('promotion')))});
test('rejects missing guided step',()=>{const id=topics[0].id;assert.ok(execute({[id]:files[id].replace('## Step 2','## No step')}).errors.some(e=>e.includes('guided step 2')))});
test('rejects registry publication',()=>assert.ok(execute({},topics[0].id+'.mdx').errors.some(e=>e.includes('published'))));
test('rejects duplicate canonical ID',()=>{const dup={lessons:[...topics,{...topics[0]}]};const r=audit({catalog:dup,load:id=>files[id]});assert.equal(r.ok,false);assert.ok(r.errors.some(e=>e.includes('duplicate')))});
test('rejects fewer than 32 topics',()=>assert.equal(audit({catalog:{lessons:topics.slice(1)},load:id=>files[id]}).ok,false));
test('rejects altered ID',()=>{const id=topics[0].id;assert.ok(execute({[id]:files[id].replace('id: "'+id+'"','id: "fake"')}).errors.some(e=>e.includes('frontmatter')))});
