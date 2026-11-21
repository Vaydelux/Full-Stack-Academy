/**
 * Real browser qualification of all sixteen staged MDX preview pages.
 * Called from academy production smoke and the dedicated draft gate.
 * Requires an already-running local Next production app and Playwright.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const lessons=JSON.parse(readFileSync(new URL('../data/curriculum.json',import.meta.url),'utf8')).lessons;
const canonical=lessons.filter(x=>x.moduleId==='09.02'||x.moduleId==='09.03').sort((a,b)=>a.id.localeCompare(b.id));
const liveIds=new Set(readdirSync(new URL('../src/content/lessons/',import.meta.url))
 .filter(name=>name.endsWith('.meta.json')).map(name=>name.slice(0,-10)));
const drafts=canonical.filter(x=>!liveIds.has(x.id));
// The eight-topic publication gate removes the promoted module from this smoke suite.
const route=id=>'/learn/projects/forms-query/drafts/'+id;
const storeKey='fullstack-academy-v1';

async function persistedQuiz(page,id){
 return page.evaluate(([key,lessonId])=>{
  const stored=localStorage.getItem(key);
  if(!stored)return null;
  const value=JSON.parse(stored);
  return value?.quizzes?.[lessonId]??null;
 },[storeKey,id]);
}
async function answerQuiz(page,lessonId,sourcePath){
 const source=readFileSync(new URL(sourcePath,import.meta.url),'utf8');
 const answer=source.match(/correctIndex=\{(\d+)\}/);
 assert.ok(answer,'Missing quiz answer source for '+lessonId);
 const quiz=page.getByRole('region',{name:'Practice knowledge check'});
 await quiz.waitFor();
 await quiz.getByRole('radio').nth(Number(answer[1])).check();
 await quiz.getByRole('button',{name:'Check answer'}).click();
 await quiz.getByText('Correct — you identified the concept.').waitFor();
}

export async function verifyFormsQueryDraftPreviews({page,base}){
 assert.equal(canonical.length,16,'Expected the full sixteen-topic catalog');
 assert.ok([0,8,16].includes(drafts.length),'Only complete eight-topic modules may transition');
 const originalViewport=page.viewportSize();
 try{
  await page.goto(base+'/learn/projects/forms-query');
  for(const topic of canonical){
   const target=liveIds.has(topic.id)?'/learn/'+topic.id:route(topic.id);
   assert.equal(await page.locator('a[href="'+target+'"]').count(),1,
    'Project roadmap must link to the correct live/draft route for '+topic.id);
  }
  // Exercise both portrait and landscape for every draft. Fully sample seven
  // representative viewport sizes on the opening topic of each module.
  // No visual pass is implied until this actual Playwright smoke has run.
  const responsiveViewports=[
   {width:320,height:780},{width:375,height:812},{width:414,height:896},
   {width:768,height:1024},{width:812,height:375},
   {width:1024,height:768},{width:1440,height:900},
  ];
  let viewportChecks=0;
  for(const [index,topic] of drafts.entries()){
   const sample=topic.id.endsWith('.01')?responsiveViewports:
    index%2===0?[responsiveViewports[0],responsiveViewports[4]]:
     [responsiveViewports[1],responsiveViewports[3]];
   for(const viewport of sample){
    await page.setViewportSize(viewport);
    const response=await page.goto(base+route(topic.id),{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,'Draft route failed '+topic.id+' at '+viewport.width+'x'+viewport.height);
    await page.getByRole('heading',{name:topic.title,level:1,exact:true}).waitFor();
    await page.getByRole('article',{name:'Preview article '+topic.id}).waitFor();
    assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1,
     'Unpublished preview must be noindex: '+topic.id);
    await page.getByText('Draft preview, not an accredited or published lesson.',{exact:false}).first().waitFor();
    await page.getByText('Draft preview: answers are for practice only and never save course completion.',{exact:true}).waitFor();
    const sizes=await page.evaluate(()=>({
     viewport:window.innerWidth,
     document:document.documentElement.scrollWidth,
     body:document.body.scrollWidth,
    }));
    assert.ok(sizes.document<=sizes.viewport&&sizes.body<=sizes.viewport,
     'Page overflow on '+topic.id+' at '+viewport.width+'x'+viewport.height+': '+JSON.stringify(sizes));
    viewportChecks++;
   }
   if(index<drafts.length-1)assert.equal(await page.locator('nav[aria-label="Draft lesson sequence"] a[href="'+route(drafts[index+1].id)+'"]').count(),1,'Missing next draft');
   if(index>0)assert.equal(await page.locator('nav[aria-label="Draft lesson sequence"] a[href="'+route(drafts[index-1].id)+'"]').count(),1,'Missing previous draft');
  }
  // Promoted lessons leave the draft catalog, but they MUST remain in
  // responsive/accessible route smoke. Check live lesson MDX and lab shell
  // without mutating course progress or pretending this is a human review.
  const publishedTopics=canonical.filter(topic=>liveIds.has(topic.id));
  let publishedViewportChecks=0;
  for(const topic of publishedTopics){
   const sample=topic.id.endsWith('.01')?responsiveViewports:
    [responsiveViewports[0],responsiveViewports[4]];
   for(const viewport of sample){
    await page.setViewportSize(viewport);
    const response=await page.goto(base+'/learn/'+topic.id,{waitUntil:'domcontentloaded'});
    assert.equal(response?.status(),200,
     'Published P1 route failed '+topic.id+' at '+viewport.width+'x'+viewport.height);
    await page.getByRole('heading',{name:topic.title,level:1,exact:true}).waitFor();
    await page.getByRole('article',{name:'Guided lesson'}).waitFor();
    const sizes=await page.evaluate(()=>({
     viewport:window.innerWidth,
     document:document.documentElement.scrollWidth,
     body:document.body.scrollWidth,
    }));
    assert.ok(sizes.document<=sizes.viewport&&sizes.body<=sizes.viewport,
     'Published P1 lesson overflow '+topic.id+' at '+viewport.width+'x'+viewport.height+
     ': '+JSON.stringify(sizes));
    publishedViewportChecks++;
   }
  }
  await page.setViewportSize({width:1440,height:900});
  if(drafts.length){
    const first=drafts[0].id;
    await page.goto(base+route(first),{waitUntil:'networkidle'});
    assert.equal(await persistedQuiz(page,first),null,'Draft quiz unexpectedly stored before attempt');
    await answerQuiz(page,first,'../drafts/forms-query/lessons/'+first+'.mdx');
    assert.equal(await persistedQuiz(page,first),null,'Correct draft quiz must not grant persisted progress');
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await persistedQuiz(page,first),null,'Draft progress persisted after reload');
  }

  // Same KnowledgeCheck must still credit PUBLISHED lessons outside context.
  const published='09.04.01';
  await page.goto(base+'/learn/'+published,{waitUntil:'networkidle'});
  await answerQuiz(page,published,'../src/content/lessons/'+published+'.mdx');
  await page.waitForFunction(([key,id])=>{
   const raw=localStorage.getItem(key);
   return raw && JSON.parse(raw).quizzes?.[id]===true;
  },[storeKey,published]);
  assert.equal(await persistedQuiz(page,published),true,
   'Published quiz must still record progress outside draft scope');

  const invalid=await page.goto(base+route('09.03.99'),{waitUntil:'domcontentloaded'});
  assert.equal(invalid?.status(),404,'Unknown draft IDs should be 404');
  console.log('Forms/Query preview browser gate passed: '+drafts.length+' noindex drafts, '+viewportChecks+' draft viewport checks, '+publishedViewportChecks+' published P1 viewport checks, '+liveIds.size+' published metadata records, navigation and quiz isolation');
 }finally{
  if(originalViewport)await page.setViewportSize(originalViewport);
 }
}
