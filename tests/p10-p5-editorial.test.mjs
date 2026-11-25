import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for(const [track,folder] of [['15','security'],['16','redis']]){
 test('P10 track '+track+' retains all 32 applied engineering walkthroughs',()=>{
  for(let m=1;m<=4;m++)for(let n=1;n<=8;n++){
   const id=track+'.'+String(m).padStart(2,'0')+'.'+String(n).padStart(2,'0');
   const mdx=readFileSync(new URL('../drafts/'+folder+'/lessons/'+id+'.mdx',import.meta.url),'utf8').replaceAll('\r\n','\n');
   const walk=mdx.match(/## Applied engineering walkthrough\n([\s\S]*?)(?=## Knowledge check)/)?.[1]??'';
   assert.ok(walk.trim().split(/\s+/).length>=110,id+' missing or shallow applied walkthrough');
   for(const marker of ['### Diagnose the concrete failure','### Independent exercise and evidence','**Qualification boundary:**'])assert.ok(walk.includes(marker),id+' missing '+marker);
   assert.equal((mdx.match(/^## Applied engineering walkthrough$/gm)||[]).length,1,id);
   assert.match(mdx,/^status: "draft-unverified"$/m,id);
   assert.match(mdx,/^(publication|readyToPublish): false$/m,id);
   assert.doesNotMatch(mdx,/^(publication|readyToPublish): true$/m,id);
   assert.doesNotMatch(mdx,/<LabGate\b/,id);
  }
 });
}
