import {expectedP1Publication,verifyP1RouteState} from './p1-browser-state.mjs';
// Isolated local Next.js + Chromium content acceptance. Not run by GitHub source authoring.
export async function verifyNodeHttpTrack({page,base,assert,wait}){
 const original=page.viewportSize();
 const ids=['01','02'].flatMap(module=>Array.from({length:8},(_,i)=>'10.'+module+'.'+String(i+1).padStart(2,'0')));
 for(const id of ids){
  const response=await page.goto(base+'/learn/'+id);
  assert.equal(response.status(),200,'Node/HTTP authored lesson route '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Published backend lesson should index '+id);
 }
 const rhfPublished=expectedP1Publication('09.02.01');
 await verifyP1RouteState(page,base,'09.02.01',rhfPublished);
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Missing indexed Node lesson '+id);
  assert.equal(sitemap.includes('/learn/09.02.01'),rhfPublished,'RHF sitemap must match tracked publication state');
 }
 await page.setViewportSize({width:320,height:800});
 await page.goto(base+'/learn/10.02.08');
 await wait(page.getByRole('heading',{name:"The problem we're solving"}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'API capstone overflows 320px');
 if(original)await page.setViewportSize(original);
 console.log('Node/HTTP lesson routes, SEO boundary and narrow viewport smoke passed');
}
