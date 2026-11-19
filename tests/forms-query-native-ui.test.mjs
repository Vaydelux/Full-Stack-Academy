import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskApi } from '../examples/forms-query-vertical/task-api.mjs';

let nextFixtureId=0;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,description){
 const deadline=Date.now()+4000;
 while(Date.now()<deadline){
  if(await predicate())return;
  await sleep(15);
 }
 throw new Error('Timed out: '+description);
}

class TestElement {
 constructor(document,tag='div'){
  this.ownerDocument=document;this.tagName=tag.toUpperCase();
  this.children=[];this.parentElement=null;this.listeners=new Map();
  this._text='';this._classes=new Set();this.value='';this.disabled=false;
  this.required=false;this.validationMessage='';
  this.classList={
   add:value=>this._classes.add(value),
   remove:value=>this._classes.delete(value),
   contains:value=>this._classes.has(value),
   toggle:(value,force)=>{
    const shouldAdd=force===undefined?!this._classes.has(value):Boolean(force);
    if(shouldAdd)this._classes.add(value);else this._classes.delete(value);
    return shouldAdd;
   },
  };
 }
 get className(){return [...this._classes].join(' ')}
 set className(value){this._classes=new Set(String(value).split(/\s+/).filter(Boolean))}
 get textContent(){return this._text+this.children.map(child=>child.textContent).join('')}
 set textContent(value){this._text=String(value);this.replaceChildren()}
 append(...items){for(const item of items){item.parentElement=this;this.children.push(item)}}
 prepend(item){item.parentElement=this;this.children.unshift(item)}
 get lastElementChild(){return this.children.at(-1)??null}
 remove(){
  if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);
 }
 replaceChildren(...items){for(const child of this.children)child.parentElement=null;this.children=[];this.append(...items)}
 addEventListener(type,callback){
  const callbacks=this.listeners.get(type)??[];
  callbacks.push(callback);this.listeners.set(type,callbacks);
 }
 dispatch(type){
  const event={type,target:this,preventDefault(){this.defaultPrevented=true}};
  return Promise.all((this.listeners.get(type)??[]).map(fn=>fn(event)));
 }
 click(){if(this.disabled)return Promise.resolve([]);return this.dispatch('click')}
 setAttribute(name,value){this[name]=String(value)}
 setCustomValidity(message){this.validationMessage=message}
 reportValidity(){
  if(this.validationMessage)return false;
  if(this.tagName==='FORM')return this.ownerDocument.getElementById('title').reportValidity();
  if(this.id==='title')return this.value.length>=3&&this.value.length<=100;
  return true;
 }
 reset(){
  this.ownerDocument.getElementById('title').value='';
  this.ownerDocument.getElementById('priority').value='normal';
 }
 focus(){this.ownerDocument.activeElement=this}
 querySelectorAll(selector){
  const classes=selector.split(',').map(part=>part.trim().replace(/^\./,''));
  const found=[];
  const walk=node=>{for(const child of node.children){
   if(classes.some(cls=>child._classes.has(cls)))found.push(child);
   walk(child);
  }};
  walk(this);return found;
 }
}

class TestDocument {
 constructor(){
  const ids=['task-form','title','priority','save','retry','discard','form-status',
   'list-status','tasks','load-more','refresh','status-filter','request-log','clear-log'];
  this.elements=new Map();
  for(const id of ids){
   const tag=['title'].includes(id)?'input':
    ['priority','status-filter'].includes(id)?'select':
    ['task-form'].includes(id)?'form':
    ['tasks'].includes(id)?'ul':
    ['request-log'].includes(id)?'ol':'button';
   const el=new TestElement(this,tag);
   el.id=id;this.elements.set(id,el);
  }
  this.getElementById('priority').value='normal';
  this.getElementById('status-filter').value='all';
  this.getElementById('retry').classList.add('hidden');
  this.getElementById('discard').classList.add('hidden');
  this.getElementById('load-more').classList.add('hidden');
  this.activeElement=null;
 }
 getElementById(id){return this.elements.get(id)??null}
 querySelector(selector){return selector.startsWith('#')?this.getElementById(selector.slice(1)):null}
 createElement(tag){return new TestElement(this,tag)}
}

const title=(doc)=>doc.getElementById('title');
const text=(doc,id)=>doc.getElementById(id).textContent;
let keyCounter=0;
const freshKey=()=>('fake-browser-test-'+String(++keyCounter).padStart(8,'0'));

async function withBrowser(run){
 const api=createTaskApi();
 const base=await api.start();
 const previous={document:globalThis.document,window:globalThis.window,fetch:globalThis.fetch};
 const doc=new TestDocument();
 const intercepted={dropNextPost:false,failNextList:false,failListAfterPost:false,pausePatch:false,releasePatch:null,requests:[]};
 const nativeFetch=previous.fetch;
 globalThis.document=doc;
 globalThis.window={location:{origin:base}};
 globalThis.fetch=async(input,init={})=>{
  const url=new URL(input,base);
  const method=init.method??'GET';
  const headers=init.headers??{};
  intercepted.requests.push({method,path:url.pathname,key:headers['idempotency-key']??null});
  if(intercepted.pausePatch&&method==='PATCH'){
   await new Promise(resolve=>{intercepted.releasePatch=resolve});
  }
  if(intercepted.failNextList && method==='GET' && url.pathname==='/api/tasks'){
   intercepted.failNextList=false;
   throw new TypeError('Simulated GET network failure');
  }
  const response=await nativeFetch(input,init);
  if(intercepted.failListAfterPost && method==='POST'){
   intercepted.failListAfterPost=false;
   intercepted.failNextList=true;
  }
  if(intercepted.dropNextPost && method==='POST'){
   intercepted.dropNextPost=false;
   throw new TypeError('Simulated response loss AFTER server committed');
  }
  return response;
 };
 try{
  const src=new URL('../examples/forms-query-vertical/browser.mjs',import.meta.url);
  await import(src.href+'?testcase='+String(++nextFixtureId));
  await until(()=>text(doc,'request-log').includes('GET 200'),'initial HTTP list');
  await run({api,base,doc,intercepted});
 }finally{
  globalThis.document=previous.document;
  globalThis.window=previous.window;
  globalThis.fetch=previous.fetch;
  await api.close();
 }
}

async function create(doc,name,priority='normal'){
 title(doc).value=name;
 doc.getElementById('priority').value=priority;
 await doc.getElementById('task-form').dispatch('submit');
}
const count=(doc)=>doc.getElementById('tasks').children.length;
const journal=(doc)=>text(doc,'request-log');
const apiList=async base=>(await (await fetch(base+'/api/tasks')).json()).items;

test('valid create uses POST 201, clears form and refreshes tasks via real Node HTTP',async()=>withBrowser(async({doc,base})=>{
 await create(doc,'Native UI task');
 await until(()=>count(doc)===1,'task created');
 assert.match(journal(doc),/POST 201/);
 assert.equal(title(doc).value,'');
 assert.equal((await apiList(base)).length,1);
}));

test('lost POST response locks fresh create and retry reuses one idempotency key',async()=>withBrowser(async({doc,base,intercepted})=>{
 intercepted.dropNextPost=true;
 await create(doc,'Unconfirmed native task');
 await until(()=>!doc.getElementById('retry').classList.contains('hidden'),'uncertain result');
 assert.equal(doc.getElementById('save').disabled,true);
 assert.equal(doc.getElementById('discard').classList.contains('hidden'),false);
 await create(doc,'Different task');
 assert.equal(intercepted.requests.filter(x=>x.method==='POST').length,1,'new POST must not be sent while unresolved');
 await doc.getElementById('retry').click();
 await until(()=>count(doc)===1,'idempotent replay');
 const posts=intercepted.requests.filter(x=>x.method==='POST');
 assert.equal(posts.length,2);
 assert.equal(posts[0].key,posts[1].key);
 assert.equal((await apiList(base)).length,1);
 assert.equal(doc.getElementById('save').disabled,false);
}));

test('explicit discard warns of possible duplicate and re-enables new create',async()=>withBrowser(async({doc,intercepted})=>{
 intercepted.dropNextPost=true;
 await create(doc,'First uncertain task');
 await until(()=>!doc.getElementById('discard').classList.contains('hidden'),'discard option');
 await doc.getElementById('discard').click();
 assert.match(text(doc,'form-status'),/duplicate/i);
 assert.equal(doc.getElementById('save').disabled,false);
 await create(doc,'Another deliberate task');
 await until(()=>count(doc)===2,'two distinct creations');
 assert.equal(intercepted.requests.filter(x=>x.method==='POST').length,2);
}));

test('terminal server 422 does not offer a misleading same-key retry',async()=>withBrowser(async({doc,base})=>{
 await create(doc,'Valid title','unauthorized-priority');
 await until(()=>text(doc,'form-status').includes('Request rejected'),'422 rejection');
 assert.equal(doc.getElementById('retry').classList.contains('hidden'),true);
 assert.equal(doc.getElementById('save').disabled,false);
 assert.equal((await apiList(base)).length,0);
 await create(doc,'Corrected title','normal');
 await until(()=>count(doc)===1,'corrected creation');
}));

test('GET failure after confirmed POST does not leave an uncertain create',async()=>withBrowser(async({doc,base,intercepted})=>{
 intercepted.failListAfterPost=true;
 await create(doc,'Committed before refresh failure');
 await until(()=>journal(doc).includes('GET error'),'post-create GET failure');
 assert.equal(doc.getElementById('retry').classList.contains('hidden'),true);
 assert.equal(doc.getElementById('save').disabled,false);
 assert.equal((await apiList(base)).length,1);
}));

test('two different write actions cannot overlap a pending status update',async()=>withBrowser(async({doc,base,intercepted})=>{
 await create(doc,'Guarded state transition');
 await until(()=>count(doc)===1,'task creation');
 intercepted.pausePatch=true;
 const change=doc.getElementById('tasks').querySelectorAll('.change-status')[0];
 const remove=doc.getElementById('tasks').querySelectorAll('.remove')[0];
 change.click();
 await until(()=>typeof intercepted.releasePatch==='function','pending PATCH');
 assert.equal(remove.disabled,true);
 await remove.click();
 assert.equal(intercepted.requests.filter(x=>x.method==='DELETE').length,0);
 intercepted.releasePatch();
 await until(()=>journal(doc).includes('PATCH 200'),'patch success');
 assert.equal((await apiList(base))[0].status,'doing');
}));

test('server cursor pages append exactly 12 unique records',async()=>withBrowser(async({doc,base})=>{
 for(let i=0;i<12;i++) {
  const r=await fetch(base+'/api/tasks',{method:'POST',headers:{
   'content-type':'application/json','idempotency-key':freshKey(),
  },body:JSON.stringify({title:'Cursor row '+i,priority:'normal'})});
  assert.equal(r.status,201);
 }
 const filter=doc.getElementById('status-filter');
 filter.value='todo';await filter.dispatch('change');
 await until(()=>count(doc)===10,'first 10 records');
 assert.equal(doc.getElementById('load-more').classList.contains('hidden'),false);
 await doc.getElementById('load-more').click();
 await until(()=>count(doc)===12,'12 records');
 assert.equal(doc.getElementById('load-more').classList.contains('hidden'),true);
}));

test('stale cursor automatically restarts on HTTP 409',async()=>withBrowser(async({doc,base})=>{
 for(let i=0;i<13;i++){
  const result=await fetch(base+'/api/tasks',{method:'POST',headers:{
   'content-type':'application/json','idempotency-key':freshKey(),
  },body:JSON.stringify({title:'Stale row '+i,priority:'normal'})});
  assert.equal(result.status,201);
 }
 const filter=doc.getElementById('status-filter');
 filter.value='todo';await filter.dispatch('change');
 await until(()=>count(doc)===10,'first cursor page');
 await fetch(base+'/api/tasks',{method:'POST',headers:{
  'content-type':'application/json','idempotency-key':freshKey(),
 },body:JSON.stringify({title:'Fresh row after cursor',priority:'normal'})});
 await doc.getElementById('load-more').click();
 await until(()=>journal(doc).includes('GET 409'),'stale cursor conflict');
 await until(()=>count(doc)===10,'restart first page');
 assert.match(text(doc,'tasks'),/Fresh row after cursor/);
}));

test('request log never stores the idempotency key or user-supplied title',async()=>withBrowser(async({doc,intercepted})=>{
 await create(doc,'Sensitive title XYZ');
 await until(()=>count(doc)===1,'created');
 const log=journal(doc);
 assert.doesNotMatch(log,/Sensitive title XYZ/);
 assert.ok(intercepted.requests.some(x=>x.key));
 const key=intercepted.requests.find(x=>x.key).key;
 assert.ok(!log.includes(key));
}));
