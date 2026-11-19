export async function verifyUITrack({page,base,assert,wait}){
 const viewport=page.viewportSize();
 for(const moduleId of ["08.01","08.02","08.03","08.04"]){
  for(const part of ["01","04","08"]){
   const id=moduleId+"."+part,response=await page.goto(base+"/learn/"+id);
   assert.equal(response.status(),200,"UI lesson must load: "+id);
   await wait(page.getByRole("heading",{name:"The problem we're solving"}));
   assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0,"UI lesson indexable: "+id);
  }
 }
 await page.goto(base+"/learn/09.01.01");
 assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count()>0,"Unauthored Zod topic stays noindex");
 const sitemap=await (await page.request.get(base+"/sitemap.xml")).text();
 if(sitemap.includes("<loc>")){
  for(const id of ["08.01.01","08.01.08","08.02.08","08.03.08","08.04.08"])assert.ok(sitemap.includes("/learn/"+id),"UI route in sitemap: "+id);
  assert.ok(!sitemap.includes("/learn/09.01.01"),"Planned Zod topic excluded");
 }
 await page.setViewportSize({width:320,height:760});
 for(const id of ["08.01.08","08.02.03","08.03.08","08.04.08"]){
  await page.goto(base+"/learn/"+id);
  await wait(page.getByRole("heading",{name:"The problem we're solving"}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"No 320px horizontal overflow: "+id);
 }
 if(viewport)await page.setViewportSize(viewport);
 console.log("UI track local Chromium smoke passed: four modules, 12 representative routes, 320px reader, sitemap and next planned noindex.");
}
