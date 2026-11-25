/** Actual Chromium acceptance for one locally projected/published Nest module. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const id=process.env.ACADEMY_NEST_MODULE;
assert.match(id??'',/^11\.0[1-4]$/);
const base=new URL(process.env.ACADEMY_BASE_URL);
assert.equal(base.hostname,'127.0.0.1');assert.equal(base.protocol,'http:');
const catalog=JSON.parse(readFileSync(new URL('../data/curriculum.json',import.meta.url),'utf8'));
const topics=catalog.lessons.filter(l=>l.moduleId===id);assert.equal(topics.length,8);
const browserRoot=process.env.ACADEMY_BROWSER_ROOT;
assert.ok(path.isAbsolute(browserRoot??''));
const {chromium}=createRequire(path.join(browserRoot,'package.json'))('playwright');
const browser=await chromium.launch({headless:true,...(process.env.ACADEMY_CHROME_BIN?{executablePath:process.env.ACADEMY_CHROME_BIN}:{})});
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 try{
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const topic of topics){
   for(const viewport of [{width:320,height:780},{width:812,height:375},{width:1440,height:900}]){
    await page.setViewportSize(viewport);
    const response=await page.goto(new URL('/learn/'+topic.id,base).href,{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,topic.id);await page.getByRole('heading',{level:1,name:topic.title,exact:true}).waitFor();
    const article=page.getByRole('article',{name:'Guided lesson'});await article.waitFor();
    assert.match(await page.locator('meta[name="robots"]').first().getAttribute('content'),/^index/);
    await article.getByRole('heading',{name:'Try it yourself — verified lab path'}).waitFor();
    await article.getByText('Run this lab locally in Node.js. No browser simulation or server-side execution.',{exact:true}).waitFor();
    assert.equal(await article.getByRole('link',{name:'Open the browser-safe interactive exercise'}).count(),0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth&&document.body.scrollWidth<=window.innerWidth),'Horizontal overflow: '+topic.id+' '+viewport.width);
   }
   const quiz=page.getByRole('region',{name:'Practice knowledge check'});await quiz.waitFor();
   const source=readFileSync(new URL('../src/content/lessons/'+topic.id+'.mdx',import.meta.url),'utf8');
   const answer=source.match(/correctIndex=\{([0-3])\}/);assert.ok(answer);
   await quiz.getByRole('radio').nth(Number(answer[1])).check();await quiz.getByRole('button',{name:'Check answer'}).click();
   await quiz.getByText('Correct — you identified the concept.',{exact:true}).waitFor();
   await page.getByRole('region',{name:'Lesson completion'}).waitFor();
   assert.equal(await page.getByRole('button',{name:'Mark complete',exact:true}).isEnabled(),false);
  }
  assert.deepEqual(errors,[],'Browser page errors');
 }finally{await context.close();}
}finally{await browser.close();}
console.log('Nest module browser acceptance: 8 lessons, 24 viewport checks, 8 knowledge checks; human accessibility not evaluated.');
