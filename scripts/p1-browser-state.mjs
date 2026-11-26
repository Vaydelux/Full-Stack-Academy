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
  // Every unpublished P1 topic has an authored reading edition. A bare
  // planned placeholder is no longer the expected route for these IDs.
  const reading=page.getByRole('article',{name:'Reading edition article'});
  const guided=page.getByRole('article',{name:'Guided lesson'});
  const completion=page.getByRole('region',{name:'Lesson completion'});
  const noCredit=page.getByText('Editorial review pending · Lab not certified · No completion credit',{exact:true});
  if(published) {
    await guided.waitFor({state:'visible'});
    await completion.waitFor({state:'visible'});
    assert.equal(await reading.count(),0,'Published route still displays reading edition: '+id);
    assert.equal(await noCredit.count(),0,'Published route still displays no-credit notice: '+id);
  } else {
    await reading.waitFor({state:'visible'});
    await noCredit.waitFor({state:'visible'});
    assert.equal(await guided.count(),0,'Unpublished route exposes published article: '+id);
    assert.equal(await completion.count(),0,'Unpublished route exposes completion gate: '+id);
    assert.equal(await page.getByRole('button',{name:'Mark complete',exact:true}).count(),0,'Unpublished route offers completion: '+id);
    assert.equal(await reading.locator('iframe, form, script').count(),0,'Reading edition executes interactive content: '+id);
  }
}
