// Local-only Next.js + Chromium smoke contract, not executed by source authoring.
export async function verifyUiTrack({page,base,assert,wait}){
 const previous=page.viewportSize();
 const ids=['01','02','03','04'].flatMap(module=>Array.from({length:8},(_,i)=>'08.'+module+'.'+String(i+1).padStart(2,'0')));
 for(const id of ids){
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'UI Systems lesson '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'UI Systems published route indexed '+id);
 }
 const planned=await page.goto(base+'/learn/09.02.01');
 assert.equal(planned.status(),200);
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'First unauthored Zod lesson must noindex');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'UI topic in sitemap '+id);
  assert.ok(!sitemap.includes('/learn/09.02.01'),'Unpublished Zod topic stays outside sitemap');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/08.04.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'UX capstone must not overflow at 320px');
 if(previous)await page.setViewportSize(previous);
 console.log('UI Systems route/browser smoke contract completed');
}
