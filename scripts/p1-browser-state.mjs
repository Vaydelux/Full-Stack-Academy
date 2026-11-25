import assert from 'node:assert/strict';

/** Determine expected publication state from independent checked-in metadata, not the browser response. */
export function p1ModuleStates(filenames) {
  const names=new Set(filenames);
  const states={};
  for(const moduleId of ['09.02','09.03']) {
    const count=Array.from({length:8},(_,i)=>moduleId+'.'+String(i+1).padStart(2,'0')+'.meta.json').filter(name=>names.has(name)).length;
    assert.ok(count===0||count===8,'Partial P1 module: '+moduleId);
    states[moduleId]=count===8;
  }
  assert.ok(!states['09.03']||states['09.02'],'Query cannot precede RHF');
  return states;
}

/** Assert the rendered route, not merely that navigation succeeded. */
export async function verifyP1RouteState(page,base,id,published) {
  const response=await page.goto(base+'/learn/'+id,{waitUntil:'domcontentloaded'});
  assert.equal(response?.status(),200,'P1 route failed: '+id);
  const robots=await page.locator('meta[name="robots"]').first().getAttribute('content');
  assert.match(robots??'',published?/^index(?:,|\s|$)/:/\bnoindex\b/,'Wrong robots directive: '+id);
  const planned=page.getByText('Planned lesson — not published.',{exact:true});
  if(published) {
    await page.getByRole('article',{name:'Guided lesson'}).waitFor();
    assert.equal(await planned.count(),0,'Published route still displays planned state: '+id);
  } else {
    await planned.waitFor();
    assert.equal(await page.getByRole('article',{name:'Guided lesson'}).count(),0,'Unpublished route exposes published article: '+id);
  }
}
