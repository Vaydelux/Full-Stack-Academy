/** Real local production-browser checks; no remote deployment or learner credit. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {join} from 'node:path';
const base=process.env.ACADEMY_BASE_URL,root=process.env.ACADEMY_BROWSER_ROOT;
assert.ok(base&&/^http:\/\/127\.0\.0\.1:\d+$/.test(base),'Local production app required');
assert.ok(root,'Set ACADEMY_BROWSER_ROOT');
const {chromium}=createRequire(join(root,'package.json'))('playwright');
const browser=await chromium.launch({headless:true,...(process.platform==='linux'&&process.getuid?.()===0?{args:['--no-sandbox']}:{})});
const key='fullstack-academy-v1',lesson='/learn/06.01.01';
try{
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const open=async path=>{const res=await page.goto(base+path);assert.equal(res?.status(),200,path);return res;};
 for(const path of ['/learn','/search?q=fetch','/reference/web-fetch','/learn/09.02.01']){
  const res=await open(path),headers=res.headers();
  assert.equal(headers['x-content-type-options'],'nosniff',path);
  assert.equal(headers['x-frame-options']?.toUpperCase(),'SAMEORIGIN',path);
  assert.equal(headers['x-powered-by'],undefined,path);
  assert.match(headers['permissions-policy']??'',/camera=\(\)/);
 }
 for(const path of ['/search?q=fetch','/learn/09.02.01']){
  await open(path);
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count(),path);
  assert.equal(await page.getByRole('region',{name:'Lesson completion'}).count(),0);
 }
 await open(lesson);
 const notebook=page.getByRole('region',{name:'Save and annotate this lesson'});
 await notebook.getByText(/Private study note/).click();
 const note=notebook.getByRole('textbox',{name:'Note for 06.01.01'});
 await note.fill('F20 synthetic local note');await notebook.getByRole('button',{name:'Save note'}).click();
 await notebook.getByText('Note saved on this device.').waitFor();
 assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).notes['06.01.01'],key),'F20 synthetic local note');
 await page.reload();await notebook.getByText(/Private study note/).click();
 await note.waitFor();assert.equal(await note.inputValue(),'F20 synthetic local note');
 assert.deepEqual(errors,[]);await context.close();

 const bad=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await bad.addInitScript(({key})=>{if(!sessionStorage.getItem('f20-seeded')){localStorage.setItem(key,'{corrupt');sessionStorage.setItem('f20-seeded','yes');}},{key});
 const tab=await bad.newPage(),badErrors=[];tab.on('pageerror',e=>badErrors.push(e.message));
 assert.equal((await tab.goto(base+lesson))?.status(),200);
 const tool=tab.getByRole('region',{name:'Save and annotate this lesson'});
 await tool.getByRole('alert').waitFor();
 await tool.getByText(/Private study note/).click();
 await tool.getByRole('textbox',{name:'Note for 06.01.01'}).fill('Unsaved synthetic note');
 await tool.getByRole('button',{name:'Save note'}).click();
 await tool.getByText(/available temporarily/).waitFor();
 assert.equal(await tab.evaluate(k=>localStorage.getItem(k),key),'{corrupt');
 await tab.getByRole('link',{name:'View saved lessons'}).click();
 await tab.getByRole('alert').filter({hasText:'Browser storage could not load or save progress'}).waitFor();
 assert.equal(await tab.evaluate(k=>localStorage.getItem(k),key),'{corrupt');
 assert.deepEqual(badErrors,[]);await bad.close();
 console.log(JSON.stringify({headers:'passed',indexing:'passed',storage:'passed',corruptStoragePreserved:true,publicationApproved:false}));
}finally{await browser.close();}
