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
 await page.goto(base+'/learn/09.01.01');
 assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count()>0,'Unauthored backend topic remains noindex');
 const xml=await (await page.request.get(base+'/sitemap.xml')).text();
 if(xml.includes('<loc>')){
  for(const id of ['06.01.01','06.05.08','07.01.01','07.03.08','07.05.08'])assert.ok(xml.includes('/learn/'+id),'Configured sitemap includes new authored topic: '+id);
  assert.ok(!xml.includes('/learn/09.01.01'),'Unauthored topic excluded from sitemap');
 }else assert.ok(xml.includes('<urlset'),'Offline builds without public origin must emit a valid empty sitemap');
 await page.setViewportSize({width:320,height:760});
 for(const id of ['06.04.08','07.03.05','07.05.08']){
  await page.goto(base+'/learn/'+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Lesson has no 320px horizontal overflow: '+id);
 }
 // Exercise interactive reference search, category filtering, empty state and reset.
 const referenceResponse=await page.goto(base+'/reference');
 assert.equal(referenceResponse.status(),200,'Reference index should load from the local Next build');
 const explorer=page.getByRole('region',{name:'Search developer references'});
 const search=explorer.getByRole('searchbox',{name:'Search by API, hook or concept'});
 await wait(search);
 await search.fill('useOptimistic');
 await wait(explorer.getByRole('link',{name:/useOptimistic/}));
 assert.equal(await explorer.getByRole('link',{name:/useOptimistic/}).count(),1,'One authored reference matches useOptimistic');
 await explorer.getByRole('checkbox',{name:'Detailed references only'}).check();
 await explorer.getByRole('combobox',{name:'Category'}).selectOption('Next.js');
 await wait(explorer.getByText('No matching references'));
 await explorer.getByRole('button',{name:'Show all references'}).click();
 await wait(explorer.getByText(/Showing 303 of 303 subjects/));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Reference explorer fits 320px without horizontal overflow');
 await explorer.getByRole('searchbox',{name:'Search by API, hook or concept'}).fill('cacheTag');
 await wait(explorer.getByRole('link',{name:/cacheTag/}));
 // Draft reference details may be browsed but must not be indexed or listed in sitemap.
 const draftResponse=await page.goto(base+'/reference/react-useoptimistic');
 assert.equal(draftResponse.status(),200,'New React reference draft route should be accessible');
 assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count()>0,'Unverified references remain noindex');
 if(xml.includes('<loc>')){
  assert.ok(!xml.includes('/reference/react-useoptimistic'),'Unverified reference excluded from sitemap');
  assert.ok(xml.includes('/reference/zod-safeparse'),'Legacy authored reference preserved in sitemap');
 }
 if(oldViewport)await page.setViewportSize(oldViewport);
 console.log('React + Next track browser smoke passed: 10 modules, 20 representative authored routes, 320px reader and reference explorer, planned noindex and sitemap policy');
}
