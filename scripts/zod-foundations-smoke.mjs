import {expectedP1Publication,verifyP1RouteState} from './p1-browser-state.mjs';
// Source-authored acceptance scenario for a locally served Next.js app + Chromium.
// Not executed by the connected GitHub file authoring environment.
export async function verifyZodFoundation({page,base,assert,wait}){
 const saved=page.viewportSize();
 const ids=Array.from({length:8},(_,i)=>'09.01.'+String(i+1).padStart(2,'0'));
 for(const id of ids){
  const res=await page.goto(base+'/learn/'+id);
  assert.equal(res.status(),200,'Published Zod foundations lesson '+id);
  await wait(page.getByRole('heading',{name:"The problem we're solving"}));
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,'Zod MDX lesson should index '+id);
 }
 const rhfPublished=expectedP1Publication('09.02.01');
 await verifyP1RouteState(page,base,'09.02.01',rhfPublished);
 const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
 if(sitemap.includes('<loc>')){
  for(const id of ids)assert.ok(sitemap.includes('/learn/'+id),'Missing Zod sitemap entry '+id);
  assert.equal(sitemap.includes('/learn/09.02.01'),rhfPublished,'RHF sitemap must match tracked publication state');
 }
 await page.setViewportSize({width:320,height:800});
 const response=await page.goto(base+'/learn/zod-profile-lab');
 assert.equal(response.status(),200,'Browser-only Zod profile route exists');
 await wait(page.getByRole('heading',{name:'Validate a profile with Zod'}));
 assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1);
 await page.getByRole('button',{name:'Validate profile'}).click();
 await wait(page.getByText('Please correct the marked fields. No data was submitted.'));
 await page.getByRole('textbox',{name:'Display name'}).fill(' Ava ');
 await page.getByRole('textbox',{name:'Email (sample only)'}).fill('AVA@EXAMPLE.COM');
 await page.getByRole('textbox',{name:'Age'}).fill('21');
 await page.getByRole('checkbox',{name:/I agree/}).check();
 await page.getByRole('button',{name:'Validate profile'}).click();
 await wait(page.getByText('Valid profile · local only'));
 const parsed=await page.locator('pre code').first().textContent();
 assert.ok(parsed.includes('"email": "ava@example.com"'),'Email normalized in actual Zod browser parse');
 assert.ok(parsed.includes('"age": 21'),'Coerced age is numeric');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Zod practice no horizontal overflow at 320px');
 await page.getByRole('button',{name:'Reset sample'}).click();
 await wait(page.getByText('Complete the form and choose Validate profile to inspect normalized values.'));
 if(saved)await page.setViewportSize(saved);
 console.log('Zod 09.01 local browser scenario passed: 8 routes, planned boundary and shared-schema practice');
}
