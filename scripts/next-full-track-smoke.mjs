import {expectedP1Publication,verifyP1RouteState} from './p1-browser-state.mjs';
// Contract for an isolated local Next.js 16 + Chromium run. Source only until executed.
export async function verifyNextFullTrack({page,base,assert,wait}){
 const original=page.viewportSize();
 const ids=['02','03','04','05'].flatMap(module=>Array.from({length:8},(_,i)=>'07.'+module+'.'+String(i+1).padStart(2,'0')));
 for(const id of ids){
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'Next.js authored route '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Authored lesson is indexable '+id);
 }
 const rhfPublished=expectedP1Publication('09.02.01');
 await verifyP1RouteState(page,base,'09.02.01',rhfPublished);
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Missing indexed lesson '+id);
  assert.equal(sitemap.includes('/learn/09.02.01'),rhfPublished,'RHF sitemap must match tracked publication state');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/07.05.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Tenant cache bug-hunt page has no 320px overflow');
 if(original)await page.setViewportSize(original);
 console.log('Full Next.js course local browser smoke: 32 authored URLs, sitemap, noindex boundary and narrow viewport');
}
