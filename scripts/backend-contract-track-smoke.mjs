export const backendContractLessonIds = ['03','04'].flatMap(module =>
 Array.from({length:8},(_,i)=>'10.'+module+'.'+String(i+1).padStart(2,'0')));

export async function verifyBackendContractTrack({page,base,assert,wait}){
 const saved=page.viewportSize();
 const ids=backendContractLessonIds;
 for(const id of ids){
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'Security/OpenAPI published lesson '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,id+' must be indexed');
 }
 const planned=await page.goto(base+'/learn/09.02.01');
 assert.equal(planned.status(),200);
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'RHF unimplemented route noindex');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Missing sitemap '+id);
  assert.ok(!sitemap.includes('/learn/09.02.01'),'RHF planned route must stay out of sitemap');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/10.04.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'OpenAPI capstone overflows at 320px');
 if(saved)await page.setViewportSize(saved);
 console.log('Track 10 Security/OpenAPI local browser route + SEO + viewport smoke passed');
}
