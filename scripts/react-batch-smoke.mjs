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
  const planned=await page.goto(base+'/learn/07.02.01');
  assert.equal(planned.status(),200);
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,'Next React module stays noindex');
  const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
  if(sitemap.includes('<loc>')) {
    for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'React published route in sitemap: '+id);
    assert.ok(!sitemap.includes('/learn/07.02.01'),'Planned React route excluded');
  }
  await page.setViewportSize({width:320,height:800});
  await page.goto(base+'/learn/06.02.08');
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'React state lab page fits 320px viewport');
  // Mounted React behavior, not SSR-only assertions.
  const practice=await page.goto(base+'/learn/react-state-lab');
  assert.equal(practice.status(),200,'React mounted practice route must load');
  await wait(page.getByRole('heading',{name:'State, identity, and reducers'}));
  const score=page.getByLabel('Current score');
  assert.equal((await score.textContent()).trim(),'Score: 0');
  await page.getByRole('button',{name:'Add 2 points'}).click();
  assert.equal((await score.textContent()).trim(),'Score: 2','Functional updates preserve both increments');
  await page.getByRole('button',{name:'Add 2 points'}).click();
  assert.equal((await score.textContent()).trim(),'Score: 4');
  await page.getByLabel('Profile draft').fill('Custom draft');
  await page.getByRole('button',{name:'Switch profile'}).click();
  assert.equal(await page.getByLabel('Profile draft').inputValue(),'Noel','Changing key resets local draft');
  await page.getByLabel('New task').fill('Exercise reducers');
  await page.getByRole('button',{name:'Add task'}).click();
  assert.equal(await page.locator('[data-task-id="task-3"]').count(),1,'New task receives stable ID');
  await page.getByRole('checkbox',{name:'Mark Exercise reducers complete'}).check();
  assert.equal(await page.getByRole('checkbox',{name:'Mark Exercise reducers complete'}).isChecked(),true);
  await page.getByRole('button',{name:'Remove Exercise reducers'}).click();
  assert.equal(await page.locator('[data-task-id="task-3"]').count(),0,'Reducer removes task by ID');
  if(initial)await page.setViewportSize(initial);
  console.log('React modules 06.01–06.02 smoke: 15 published routes, noindex boundary, sitemap and mobile layout');
}
