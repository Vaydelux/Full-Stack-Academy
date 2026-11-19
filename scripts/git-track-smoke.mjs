// Exact-head local Next.js+Chromium integration test for the Git/Team/Monorepo track.
// Node labs separately execute real, isolated temporary Git repositories and TypeScript contracts.
export async function verifyGitTrack({page,base,assert,wait}){
 const initialViewport=page.viewportSize();
 const modules=['05.01','05.02','05.03'];
 for(const moduleId of modules){
  for(const suffix of ['01','08']){
   const id=moduleId+'.'+suffix;
   const response=await page.goto(base+'/learn/'+id);
   assert.equal(response.status(),200,'Authored Git track lesson should be served: '+id);
   await wait(page.getByRole('heading',{name:"The problem we're solving"}));
   assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored Git lesson should be indexable: '+id);
  }
 }
 const planned=await page.goto(base+'/learn/09.01.01');
 assert.equal(planned.status(),200,'Next planned React lesson should remain discoverable');
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Planned React content remains noindex');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ['05.01.01','05.01.08','05.02.01','05.02.08','05.03.01','05.03.08'])assert.ok(sitemap.includes('/learn/'+id),'Configured sitemap includes Git lesson: '+id);
  assert.ok(!sitemap.includes('/learn/09.01.01'),'Planned React topic excluded from sitemap');
 }else{
  assert.ok(sitemap.includes('<urlset'),'No public origin means an empty, valid sitemap instead of guessed localhost URLs');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/05.03.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Git capstone reading layout fits mobile');
 const main=await page.getByRole('main').count();
 assert.ok(main>0,'Git lesson has semantic main content');
 if(initialViewport)await page.setViewportSize(initialViewport);
 console.log('Git track smoke passed: 3 complete modules, six authored routes, planned noindex, local sitemap policy and mobile capstone layout');
}
