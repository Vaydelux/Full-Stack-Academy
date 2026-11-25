import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {join} from 'node:path';
const base=process.env.ACADEMY_BASE_URL, root=process.env.ACADEMY_BROWSER_ROOT;
assert.ok(base&&/^http:\/\/127\.0\.0\.1:\d+$/.test(base),'Local app required');
assert.ok(root,'Playwright root required');
const {chromium}=createRequire(join(root,'package.json'))('playwright');
const browser=await chromium.launch({headless:true,...(process.platform==='linux'&&process.getuid?.()===0?{args:['--no-sandbox']}:{})});
try {
 for(const viewport of [{width:320,height:780},{width:812,height:375},{width:1024,height:768},{width:1440,height:900}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/learn','/reference','/learn/09.02.01','/reference/web-fetch','/learn/dashboard','/search?q=fetch']){
   assert.equal((await page.goto(base+path))?.status(),200,path);
   await page.locator('#doc-main').waitFor();
   assert.ok(await page.evaluate(()=>{const el=document.querySelector('[data-doc-shell]');return el&&el.scrollWidth<=el.clientWidth&&document.documentElement.scrollWidth<=innerWidth;}),'horizontal overflow '+path+' '+viewport.width);
  }
  await page.goto(base+'/learn/09.02.01');
  if(viewport.width<1024)await page.getByRole('button',{name:'Curriculum navigation'}).click();
  const active=page.getByRole('navigation',{name:'Curriculum sections'}).locator('a[aria-current="page"]');
  assert.equal(await active.getAttribute('href'),'/learn/09.02.01');
  await page.goto(base+'/search');
  await page.getByRole('searchbox',{name:'Search topics and references'}).fill('fetch');
  await page.getByLabel('Search in').selectOption('references');
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await page.waitForURL(/scope=references/);
  assert.ok(await page.locator('#doc-main a[href="/reference/web-fetch"]').count());
  assert.equal(await page.locator('#doc-main a[href^="/learn/"]').count(),0);
  assert.deepEqual(errors,[]);
  await context.close();
 }
 console.log('F17 responsive and discovery smoke passed');
}finally{await browser.close();}
