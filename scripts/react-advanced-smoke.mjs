// Source-authored local Next/Chromium integration gate. Not executed in the connected GitHub-only environment.
export async function verifyReactAdvanced({page,base,assert,wait}) {
 const previousViewport=page.viewportSize();
 const ids=[...Array.from({length:8},(_,i)=>`06.03.${String(i+1).padStart(2,'0')}`),
            ...Array.from({length:8},(_,i)=>`06.04.${String(i+1).padStart(2,'0')}`)];
 for(const id of ids) {
   const response=await page.goto(base+'/learn/'+id);
   assert.equal(response.status(),200,'React Effects/Advanced route: '+id);
   await wait(page.getByRole('heading',{name:"The problem we're solving"}));
   assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored React advanced lesson must index: '+id);
 }
 await page.goto(base+'/learn/08.01.01');
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Testing Library remains planned until its runnable dependencies are integrated');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')) {
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Authored React advanced route in sitemap: '+id);
  assert.ok(!sitemap.includes('/learn/08.01.01'),'Planned topic must not enter sitemap');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/06.04.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Optimistic comments lesson fits mobile viewport');
 if(previousViewport)await page.setViewportSize(previousViewport);
 console.log('React advanced route smoke authored: 16 routes, planned noindex, sitemap, 320px');
}
