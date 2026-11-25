import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectStagedManuscripts } from '../scripts/staged-inventory.mjs';
import { readingInventory, parseReading } from '../scripts/reading-edition.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>readFileSync(join(root,p),'utf8');
test('actual checkout manuscripts cover canonical remaining topics and render nonempty data blocks',()=>{
 const catalog=JSON.parse(read('data/curriculum.json'));
 const checkpoint=JSON.parse(read('docs/checkpoint.json')).snapshot;
 const authored=read('src/lib/academy/authored-content.ts').match(/export const AUTHORED_LESSON_IDS\s*=\s*\[([^\]]+)\]/);
 assert.ok(authored);
 const interactive=[...authored[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
 const mdx=readdirSync(join(root,'src/content/lessons')).filter(n=>n.endsWith('.meta.json')).map(n=>JSON.parse(read('src/content/lessons/'+n)).id);
 const published=[...new Set([...interactive,...mdx])];
 assert.equal(published.length,checkpoint.publishedLessons);
 const records=readingInventory(collectStagedManuscripts(root,catalog),published);
 assert.equal(records.length+published.length,catalog.lessons.length);
 assert.deepEqual(records.map(r=>r.id),catalog.lessons.filter(l=>!published.includes(l.id)).map(l=>l.id).sort());
 for(const r of records){const blocks=parseReading(r.source);assert.ok(blocks.length>=5,'Insufficient reading blocks '+r.id);assert.ok(blocks.some(b=>b.kind==='heading'),'Missing heading '+r.id);}
});
test('reader remains separate from progress, lab execution and sitemap; canonical route favors published registry',()=>{
 const page=read('src/app/learn/[lessonId]/page.tsx'),reader=read('src/components/course/ReadingEditionArticle.tsx'),sitemap=read('src/app/sitemap.ts'),library=read('src/app/learn/reading/page.tsx');
 assert.match(page,/!authored && !mdxMeta \? readReadingLesson\(lessonId\)/);
 assert.match(page,/readReadingIds\(\)\]\.map/);
 assert.match(page,/robots: \{ index: false, follow: true \}/);
 const branch=page.slice(page.indexOf('if (reading) {'),page.indexOf('const staged ='));
 assert.match(branch,/<ReadingEditionArticle source=\{reading.source\}/);
 assert.doesNotMatch(branch+reader,/dangerouslySetInnerHTML|<LabGate|<LocalLessonCompletion|<KnowledgeCheck|<LessonNotebook|useAcademy|markQuizPassed|markLessonComplete/);
 assert.match(library,/edition="reading"/);
 assert.match(sitemap,/PUBLISHED_LESSON_IDS/);assert.doesNotMatch(sitemap,/readReadingIds|readReadingLesson/);
});
