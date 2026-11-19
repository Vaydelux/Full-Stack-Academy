import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const curriculum = JSON.parse(read('data/curriculum.json'));
const referenceIndex = JSON.parse(read('data/reference-index.json'));
const lessonFiles = fs.readdirSync(path.join(root,'src/content/lessons')).filter(n=>n.endsWith('.meta.json'));
const mdxIds = lessonFiles.map(name=>JSON.parse(read('src/content/lessons/'+name)).id);
const authored = read('src/lib/academy/authored-content.ts');
const idList = authored.match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
assert.ok(idList, 'Could not locate authored interactive lesson IDs');
const interactiveIds = [...idList[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const refSection = authored.split('export const AUTHORED_REFERENCES')[1]?.split('export function findAuthoredReference')[0];
assert.ok(refSection, 'Could not locate authored references');
const references = [...refSection.matchAll(/^\s*(?:id:\s*'([^']+)'|"id":\s*"([^"]+)")/gm)].map(m=>m[1] ?? m[2]);
const labs = fs.readdirSync(path.join(root,'labs')).filter(slug=>fs.existsSync(path.join(root,'labs',slug,'lab.json')));
const published = [...new Set([...interactiveIds,...mdxIds])];
const completeModules = [...new Set(curriculum.lessons.map(l=>l.moduleId))].filter(
  moduleId => curriculum.lessons.filter(l=>l.moduleId===moduleId).every(l=>published.includes(l.id))
).sort();
const snapshot = {
  tracks:curriculum.tracks.length, modules:curriculum.modules.length,
  catalogTopics:curriculum.lessons.length,indexedReferences:referenceIndex.entries.length,
  authoredReferenceDrafts:references.length, authoredInteractiveModels:interactiveIds.length,
  authoredMdxLessons:mdxIds.length,publishedLessons:published.length,
  labFixtures:labs.length, completeModules
};
const file='docs/checkpoint.json';
const checkpoint=JSON.parse(read(file));
if(process.argv.includes('--write')){
  checkpoint.updatedAt=new Date().toISOString().slice(0,10);
  checkpoint.snapshot=snapshot;
  fs.writeFileSync(path.join(root,file),JSON.stringify(checkpoint,null,2)+'\n');
  console.log('Updated '+file);
}else if(process.argv.includes('--check')){
  assert.deepEqual(checkpoint.snapshot,snapshot,
    'Stale checkpoint: run npm run checkpoint:write and commit docs/checkpoint.json');
  console.log('Checkpoint matches repository:',JSON.stringify(snapshot));
}else{
  console.log(JSON.stringify({checkpoint,actual:snapshot},null,2));
}
