// Integration checks require an already-running local Next server and an isolated Playwright browser.
// Do not claim browser success from file presence or from server-rendered React tests.
export async function verifyReactBatch({page,base,assert,wait}) {
  const initial=page.viewportSize();
  const ids=[...Array.from({length:7},(_,i)=>`06.01.${String(i+2).padStart(2,'0')}`),
    ...Array.from({length:8},(_,i)=>`06.02.${String(i+1).padStart(2,'0')}`)];
  for(const id of ids) {
    const response=await page.goto(base+'/learn/'+id);
    assert.equal(response.status(),200,'React authored lesson resolves: '+id);
    await wait(page.getByRole('heading',{name:"The problem we're solving"}));
    assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'React authored lesson must be indexable: '+id);
  }
  const planned=await page.goto(base+'/learn/06.03.01');
  assert.equal(planned.status(),200);
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Next React module stays noindex');
  const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
  if(sitemap.includes('<loc>')) {
    for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'React published route in sitemap: '+id);
    assert.ok(!sitemap.includes('/learn/06.03.01'),'Planned React route excluded');
  }
  await page.setViewportSize({width:320,height:800});
  await page.goto(base+'/learn/06.02.08');
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'React state lab page fits 320px viewport');
  if(initial)await page.setViewportSize(initial);
  console.log('React modules 06.01–06.02 smoke: 15 published routes, noindex boundary, sitemap and mobile layout');
}
