import {expectedP1Publication,verifyP1RouteState} from './p1-browser-state.mjs';
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
 const rhfPublished=expectedP1Publication('09.02.01');
 await verifyP1RouteState(page,base,'09.02.01',rhfPublished);
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')) {
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Authored React advanced route in sitemap: '+id);
  assert.equal(sitemap.includes('/learn/09.02.01'),rhfPublished,'RHF sitemap must match tracked publication state');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/06.04.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Optimistic comments lesson fits mobile viewport');
 if(previousViewport)await page.setViewportSize(previousViewport);
 console.log('React advanced route smoke authored: 16 routes, planned noindex, sitemap, 320px');
}
