// Local Next.js + Chromium acceptance; source-authored, not executed in this connector session.
export async function verifyZustandState({page,base,assert,wait}){
 const size=page.viewportSize();
 const ids=Array.from({length:8},(_,i)=>'09.04.'+String(i+1).padStart(2,'0'));
 for(const id of ids){
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'Authored Zustand lesson '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Published Zustand lesson should index '+id);
 }
 const planned=await page.goto(base+'/learn/09.02.01');
 assert.equal(planned.status(),200);
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'RHF remains planned and noindex');
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Missing Zustand sitemap entry '+id);
  assert.ok(!sitemap.includes('/learn/09.02.01'),'Unpublished RHF should not enter sitemap');
 }
 await page.setViewportSize({width:320,height:800});
 const response=await page.goto(base+'/learn/state-boundaries-lab');
 assert.equal(response.status(),200);
 await wait(page.getByRole('heading',{name:'Build a predictable filter store'}));
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1);
 await wait(page.getByText('6 of 6 resources shown'));
 await page.getByRole('searchbox',{name:'Search catalogue'}).fill('react');
 await wait(page.getByText('2 of 6 resources shown'));
 await page.getByRole('button',{name:'Courses'}).click();
 await wait(page.getByText('1 of 6 resources shown'));
 await page.getByRole('button',{name:'Compact'}).click();
 assert.equal(await page.getByRole('button',{name:'Compact'}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Show store code'}).click();
 assert.equal(await page.locator('#zustand-source').count(),1);
 await page.getByRole('button',{name:'Reset filters'}).click();
 await wait(page.getByText('6 of 6 resources shown'));
 assert.equal(await page.getByRole('searchbox',{name:'Search catalogue'}).inputValue(),'');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Store gallery does not overflow 320px');
 if(size)await page.setViewportSize(size);
 console.log('Zustand 5 local browser scenario: authored routes, noindex boundary, search, filter, density, source and reset');
}
