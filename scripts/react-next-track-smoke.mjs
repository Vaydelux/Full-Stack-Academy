// Local Next production-build route checks; it does not execute standalone Next labs.
// React SSR labs are tested by the local tsx test suite, not by this browser smoke.
export async function verifyReactNextTrack({page,base,assert,wait}){
 const oldViewport=page.viewportSize();
 const modules=['06.01','06.02','06.03','06.04','06.05','07.01','07.02','07.03','07.04','07.05'];
 for(const moduleId of modules){
  for(const suffix of ['01','08']){
   const id=moduleId+'.'+suffix;
   const response=await page.goto(base+'/learn/'+id);
   assert.equal(response.status(),200,'Authored React/Next lesson route loads: '+id);
   await wait(page.getByRole('heading',{name:"The problem we're solving"}));
   assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored lesson must be indexable: '+id);
  }
 }
 await page.goto(base+'/learn/08.01.01');
 assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count()>0,'Unauthored backend topic remains noindex');
 const xml=await (await page.request.get(base+'/sitemap.xml')).text();
 if(xml.includes('<loc>')){
  for(const id of ['06.01.01','06.05.08','07.01.01','07.03.08','07.05.08'])assert.ok(xml.includes('/learn/'+id),'Configured sitemap includes new authored topic: '+id);
  assert.ok(!xml.includes('/learn/08.01.01'),'Unauthored topic excluded from sitemap');
 }else assert.ok(xml.includes('<urlset'),'Offline builds without public origin must emit a valid empty sitemap');
 await page.setViewportSize({width:320,height:760});
 for(const id of ['06.04.08','07.03.05','07.05.08']){
  await page.goto(base+'/learn/'+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Lesson has no 320px horizontal overflow: '+id);
 }
 if(oldViewport)await page.setViewportSize(oldViewport);
 console.log('React + Next track browser smoke passed: 10 modules, 20 representative authored routes, 320px reader, planned noindex and sitemap policy');
}
