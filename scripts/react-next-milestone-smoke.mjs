// This is a local Chromium/Next acceptance contract, NOT an executed browser result.
export async function verifyReactNextMilestone({page,base,assert,wait}) {
 const previous=page.viewportSize();
 const ids=[...Array.from({length:8},(_,i)=>'06.05.'+String(i+1).padStart(2,'0')),
            ...Array.from({length:8},(_,i)=>'07.01.'+String(i+1).padStart(2,'0'))];
 for (const id of ids) {
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'Published course lesson '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored lesson indexable '+id);
 }
 const planned=await page.goto(base+'/learn/07.02.01');
 assert.equal(planned.status(),200);
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Next planned topic remains noindex');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Authored topic sitemap '+id);
  assert.ok(!sitemap.includes('/learn/07.02.01'),'No planned topic in sitemap');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/07.01.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Next Router capstone fits 320px');
 if(previous)await page.setViewportSize(previous);
 console.log('React 06.05 and Next 07.01 source-authored browser smoke complete');
}
