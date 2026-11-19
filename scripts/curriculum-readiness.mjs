/**
 * Deterministic, offline curriculum coverage report.
 * Compute against source truth; never infer publication from plan docs.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=filename=>fs.readFileSync(path.join(root,filename),'utf8');
const curriculum=JSON.parse(read('data/curriculum.json'));
const checkpoint=JSON.parse(read('docs/checkpoint.json'));
const authored=read('src/lib/academy/authored-content.ts');
const idsSection=authored.match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
assert.ok(idsSection,'Cannot inspect authored interactive lesson IDs');
const interactive=[...idsSection[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
const mdxFiles=fs.readdirSync(path.join(root,'src/content/lessons')).filter(name=>name.endsWith('.meta.json'));
const mdx=mdxFiles.map(name=>JSON.parse(read('src/content/lessons/'+name)).id);
const published=new Set([...interactive,...mdx]);
const stagingRoot=path.join(root,'drafts/forms-query/lessons');
const staged=fs.existsSync(stagingRoot)
 ? new Set(fs.readdirSync(stagingRoot).filter(n=>n.endsWith('.meta.json')).map(n=>JSON.parse(read('drafts/forms-query/lessons/'+n)).id))
 : new Set();
const modules=curriculum.modules.map(module=>{
 const topics=curriculum.lessons.filter(topic=>topic.moduleId===module.id);
 const actual=topics.filter(topic=>published.has(topic.id)).length;
 const draft=topics.filter(topic=>staged.has(topic.id)&&!published.has(topic.id)).length;
 return {id:module.id,title:module.title,track:module.track,total:topics.length,published:actual,staged:draft,
  notStarted:topics.length-actual-draft,complete:actual===topics.length};
});
const totals={
 tracks:curriculum.tracks.length,modules:modules.length,topics:curriculum.lessons.length,
 published:published.size,stagedUnpublished:[...staged].filter(id=>!published.has(id)).length,
 plannedWithoutStaging:curriculum.lessons.length-published.size-[...staged].filter(id=>!published.has(id)).length,
 completeModules:modules.filter(m=>m.complete).length,incompleteModules:modules.filter(m=>!m.complete).length,
};
if(process.argv.includes('--check')){
 assert.equal(totals.tracks,checkpoint.snapshot.tracks);
 assert.equal(totals.modules,checkpoint.snapshot.modules);
 assert.equal(totals.topics,checkpoint.snapshot.catalogTopics);
 assert.equal(totals.published,checkpoint.snapshot.publishedLessons);
 assert.equal(totals.completeModules,checkpoint.snapshot.completeModules.length);
 assert.ok([...staged].every(id=>curriculum.lessons.some(topic=>topic.id===id)), 'Unknown staged lesson ID');
 assert.ok([...staged].every(id=>!published.has(id)), 'Staged topic accidentally published');
}
if(process.argv.includes('--json'))console.log(JSON.stringify({totals,modules},null,2));
else {
 console.log('Curriculum coverage:',JSON.stringify(totals,null,2));
 console.log('\nNext incomplete module families:');
 for(const m of modules.filter(m=>!m.complete).slice(0,24)){
  console.log(m.id.padEnd(7)+m.title.padEnd(33).slice(0,33)+'  '+m.published+'/'+m.total+' published · '+m.staged+' staged');
 }
 if(modules.filter(m=>!m.complete).length>24)console.log('Use --json for the full module inventory');
}
