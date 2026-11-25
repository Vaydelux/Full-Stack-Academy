import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReading } from '../scripts/reading-edition.mjs';
import { readingOutline, readingModuleNavigation } from '../scripts/reading-navigation.mjs';
test('frontmatter manuscript title is not repeated; all other sections remain', () => {
  const source = '---\nid: "16.01.01"\n---\n\n# Why caches exist\n\n> Draft.\n\n## Learning outcomes\n\n## Context\n\n## Context';
  const model = readingOutline(parseReading(source), 'Why caches exist');
  assert.deepEqual(model.outline.map(x => x.id), ['reading-learning-outcomes', 'reading-context', 'reading-context-2']);
  assert.equal(model.blocks[0].kind, 'quote');
  assert.equal(model.blocks.length, 4);
});
test('MDX step anchors and heading collisions are stable and unique', () => {
  const blocks = [{kind:'heading',level:2,text:'Step 1 — Verify'}, {kind:'step',title:'Step 1 — Verify',file:'sample.ts',expected:'ok'}, {kind:'heading',level:3,text:'État / état'}, {kind:'heading',level:2,text:'!!!'}];
  const first = readingOutline(blocks, 'Other');
  assert.deepEqual(first.outline.map(x=>x.id), ['reading-step-1-verify','reading-step-1-verify-2','reading-état-état','reading-section']);
  assert.deepEqual(first,readingOutline(blocks,'Other'));
  assert.ok(blocks.every(x=>!Object.hasOwn(x,'anchor')));
});
test('non-leading repeated title is preserved and code is not interpreted as headings', () => {
  const model=readingOutline(parseReading('Intro\n\n## Title\n\n```md\n# Title\n```'),'Title');
  assert.equal(model.outline.length,1);assert.equal(model.blocks.at(-1).text,'# Title');
});
test('module navigation excludes planned topics, favors published overlap and marks current reading',()=>{
 const topics=[{id:'12.01.01',moduleId:'12.01',title:'First'},{id:'12.01.02',moduleId:'12.01',title:'Second'},{id:'12.01.03',moduleId:'12.01',title:'Planned'},{id:'12.02.01',moduleId:'12.02',title:'Other'}];
 assert.deepEqual(readingModuleNavigation(topics,['12.01.01'],['12.01.01','12.01.02','12.02.01'],'12.01.02'),[{id:'12.01.01',title:'First',edition:'published',active:false},{id:'12.01.02',title:'Second',edition:'reading',active:true}]);
 assert.deepEqual(readingModuleNavigation(topics,['12.01.01'],['12.01.01'],'12.01.01'),[]);
 assert.deepEqual(readingModuleNavigation(topics,[],[],'12.01.03'),[]);
});
