import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8').replaceAll('\r\n','\n');
const scopes=[
 ['p6-operations',{'21':3,'22':3,'23':4}],
 ['p7-platforms',{'24':4,'25':4}],
 ['p7-enterprise',{'26':4,'27':4}],
];
for(const [family,tracks] of scopes){
 const specifications=JSON.parse(read('drafts/'+family+'/topics.json'));
 for(const [track,count] of Object.entries(tracks)){
  test('P10 '+track+' applied walkthroughs and draft integrity',()=>{
   for(let m=1;m<=count;m++)for(let n=1;n<=8;n++){
    const id=track+'.'+String(m).padStart(2,'0')+'.'+String(n).padStart(2,'0');
    const mdx=read('drafts/'+family+'/lessons/'+id+'.mdx');
    const walk=mdx.match(/## Applied engineering walkthrough\n([\s\S]*?)(?=## Knowledge check)/)?.[1]??'';
    assert.ok(walk.trim().split(/\s+/).length>=100,id+' missing or shallow walkthrough');
    for(const marker of ['### Diagnose the concrete failure','### Independent exercise and evidence','**Evidence boundary:**'])assert.ok(walk.includes(marker),id+' missing '+marker);
    assert.equal((mdx.match(/^## Applied engineering walkthrough$/gm)||[]).length,1,id);
    const front=mdx.match(/^---\n([\s\S]*?)\n---\n/)?.[1]??'';
    assert.match(front,/^status: "draft-unverified"$/m,id);
    assert.equal((front.match(/^readyToPublish: false$/gm)||[]).length,1,id);
    assert.equal((front.match(/^readyToPublish:/gm)||[]).length,1,id);
    assert.doesNotMatch(mdx,/<LabGate\b/,id);
    if(['21.02.05','23.04.03'].includes(id))assert.ok(walk.includes('does not calculate the delay plus next attempt duration'),id+' missing retry model limitation');
    assert.ok(specifications[id],id+' missing specification');
    for(const [key,value] of Object.entries(specifications[id]))assert.ok(mdx.includes(value),id+' specification drift '+key);
   }
  });
 }
}
