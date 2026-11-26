/** Local production reading-route smoke. Real browser only; not lab certification. */
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {collectStagedManuscripts} from './staged-inventory.mjs';
import {buildRouteInventory,verifyRouteInventory} from './release-route-inventory.mjs';
import {readingInventory} from './reading-edition.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const catalog=JSON.parse(readFileSync(join(root,'data/curriculum.json'),'utf8'));
const authored=readFileSync(join(root,'src/lib/academy/authored-content.ts'),'utf8').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
assert.ok(authored);
const published=[...new Set([...authored[1].matchAll(/'([^']+)'/g)].map(m=>m[1]).concat(readdirSync(join(root,'src/content/lessons')).filter(n=>n.endsWith('.meta.json')).map(n=>n.slice(0,-10))))];
const remaining=readingInventory(collectStagedManuscripts(root,catalog),published);
const topics=new Map(catalog.lessons.map(l=>[l.id,l]));
const sample=[...new Map(remaining.map(r=>[r.group,r])).values()];
assert.equal(published.length+remaining.length,catalog.lessons.length);
const base=process.env.ACADEMY_BASE_URL;
assert.ok(base&&/^http:\/\/127\.0\.0\.1:\d+$/.test(base),'Local production app required');
const references=JSON.parse(readFileSync(join(root,'data/reference-index.json'),'utf8')).entries;
const routeReport=await verifyRouteInventory(base,buildRouteInventory(catalog.lessons,references));
console.log(JSON.stringify({routeReport}));
assert.ok(routeReport.passed,'Exhaustive route inventory failed');
const browserRoot=process.env.ACADEMY_BROWSER_ROOT;
assert.ok(browserRoot,'Set ACADEMY_BROWSER_ROOT to installed Playwright');
const {chromium}=createRequire(join(browserRoot,'package.json'))('playwright');
const browser=await chromium.launch({headless:true,...(process.platform==='linux'&&process.getuid?.()===0?{args:['--no-sandbox']}: {})});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const storage=()=>page.evaluate(()=>localStorage.getItem('fullstack-academy-v1'));
 assert.equal((await page.goto(base+'/learn/reading'))?.status(),200);
 await page.getByRole('heading',{name:'Reading editions',level:1}).waitFor();
 await page.getByText(remaining.length+' authored manuscripts for reading and independent study.',{exact:true}).waitFor();
 const before=await storage();
 assert.equal((await page.goto(base+'/learn'))?.status(),200);
 await page.getByRole('heading',{name:'Find any curriculum topic'}).waitFor();
 const availability=page.getByLabel('Learning availability');
 await availability.selectOption('reading');
 await page.getByRole('status').filter({hasText:remaining.length+' matching topics'}).waitFor();
 await availability.selectOption('published');
 await page.getByRole('status').filter({hasText:published.length+' matching topics'}).waitFor();
 await availability.selectOption('all');
 await page.getByRole('status').filter({hasText:catalog.lessons.length+' matching topics'}).waitFor();
 assert.equal((await page.goto(base+'/learn/reading'))?.status(),200);
 if(sample.length){
  const first=sample[0];const search=page.getByRole('searchbox',{name:'Search lessons'});
  await search.fill(first.id);
  await page.getByRole('link',{name:new RegExp(topics.get(first.id).title.replace(/[.*+?^\x24{}()|[\]\\]/g,'\\$&'))}).filter({hasText:first.id}).first().waitFor();
 }
 let count=0;
 for(const record of sample){
  for(const viewport of [{width:320,height:780},{width:812,height:375},{width:1440,height:900}]){
   await page.setViewportSize(viewport);
   assert.equal((await page.goto(base+'/learn/'+record.id,{waitUntil:'domcontentloaded'}))?.status(),200,record.id);
   await page.getByRole('heading',{name:topics.get(record.id).title,level:1,exact:true}).waitFor();
   const article=page.getByRole('article',{name:'Reading edition article'});await article.waitFor();
   assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1);
   assert.equal(await page.getByRole('region',{name:'Lesson completion'}).count(),0);
   assert.equal(await page.getByRole('button',{name:'Mark complete',exact:true}).count(),0);
   assert.equal(await article.locator('iframe, form, script').count(),0);
   const continuation=page.getByRole('navigation',{name:'Continue curriculum'});
   const available=catalog.lessons.filter(l=>published.includes(l.id)||remaining.some(r=>r.id===l.id));
   const index=available.findIndex(l=>l.id===record.id);
   if(index>0)assert.equal(await continuation.locator('a[rel="prev"]').getAttribute('href'),'/learn/'+available[index-1].id);
   if(index<available.length-1)assert.equal(await continuation.locator('a[rel="next"]').getAttribute('href'),'/learn/'+available[index+1].id);
   const moduleNav=page.getByRole('navigation',{name:'Reading module lessons',includeHidden:true});
   assert.equal(await moduleNav.locator('a[aria-current="page"]').getAttribute('href'),'/learn/'+record.id);
   const outline=article.getByRole('navigation',{name:'Reading section outline',includeHidden:true});
   const targets=await outline.locator('a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
   assert.ok(targets.length>0,'Missing reading outline '+record.id);
   assert.equal(new Set(targets).size,targets.length,'Duplicate section anchors '+record.id);
   for(const target of targets)assert.equal(await page.evaluate(id=>document.getElementById(id.slice(1))!==null,target),true,'Missing section anchor '+target);
   const reveal=article.getByText('Reveal answer and explanation',{exact:true}).first();
   if(await reveal.count())await reveal.click();
   assert.equal(await storage(),before,'Reading must not mutate course progress '+record.id);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.body.scrollWidth<=innerWidth),'Reading overflow '+record.id);
   count++;
  }
 }
 assert.equal((await page.goto(base+'/learn/roadmap'))?.status(),200);
 await page.getByRole('progressbar',{name:'Reading access share'}).waitFor();
 assert.equal(await page.getByRole('progressbar',{name:'Reading access share'}).getAttribute('value'),String(catalog.lessons.length));
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({readingCandidates:remaining.length,groupsSampled:sample.length,viewportChecks:count,readingBrowserSmokePassed:true,labCertified:false,manualReviewRequired:true}));
 await context.close();
}finally{await browser.close();}
