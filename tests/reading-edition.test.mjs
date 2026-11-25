import test from 'node:test';
import assert from 'node:assert/strict';
import { readingInventory, parseReading, inlineTokens, safeReference } from '../scripts/reading-edition.mjs';
const fence = '`'.repeat(3);
const source = ["import { LearningGoals, LessonStep, Misconception } from '@/components/course/LessonBlocks';", "import { KnowledgeCheck } from '@/components/course/KnowledgeCheck';", '<LearningGoals items={["Learn {a} and \\"b\\".","Distinguish draft from certified."]} />', '## The problem', 'Read **important** `code` and [official](https://example.org/docs).', '<LessonStep number={1} title="Observe the bug" file="starter.ts" expected={"Return {value}."}>', fence+'tsx', '<script>alert("example")</script>', 'const value = { a: 1 };', fence, '</LessonStep>', '<Misconception claim="Not proof" correction="Use a real test." />', '<KnowledgeCheck question="Which?" choices={["Bad","Good"]} correctIndex={1} explanation="Good is correct." misconception="Bad is incorrect." lessonId="09.02.01" />', '| A | B |', '| --- | --- |', '| 1 | 2 |'].join('\n');
test('MDX teaching blocks become data-only reading elements and preserve code exactly', () => {
 const blocks=parseReading(source); assert.deepEqual(blocks.map(b=>b.kind),['list','heading','paragraph','step','code','quote','quiz','table']);
 assert.deepEqual(blocks[0].items,['Learn {a} and "b".','Distinguish draft from certified.']); assert.equal(blocks[3].file,'starter.ts'); assert.equal(blocks[4].text,'<script>alert("example")</script>\nconst value = { a: 1 };'); assert.equal(blocks[6].answer,1); assert.deepEqual(blocks[7].rows,[['1','2']]);
});
test('frontmatter and Markdown reading supports prose, headings, quotes, numbered lists and fences',()=>{
 const b=parseReading(['---','id: "26.01.01"','status: "draft-unverified"','---','# Lesson','> Unverified','1. First','2. Second',fence+'bash','echo ok',fence].join('\r\n'));
 assert.deepEqual(b.map(x=>x.kind),['heading','quote','list','code']);assert.equal(b[0].level,2);assert.deepEqual(b[2].items,['First','Second']);assert.equal(b[3].text,'echo ok');
});
test('unknown executable MDX, malicious attributes and raw HTML remain inert literal text',()=>{
 const s=['import Thing from "malicious";','<script>alert(1)</script>','<KnowledgeCheck question={globalThis.alert(1)} />','<img src="x" onerror="alert(1)" />','{process.exit(9)}'].join('\n');assert.deepEqual(parseReading(s),[{kind:'paragraph',text:s}]);
});
test('only absolute HTTPS references become links; javascript, data and credentials are inert',()=>{
 assert.equal(safeReference('javascript:alert(1)'),null);assert.equal(safeReference('data:text/html,test'),null);assert.equal(safeReference('https://user:pass@example.org/'),null);assert.equal(safeReference('//example.org'),null);
 const tokens=inlineTokens('**bold** `code` [safe](https://example.org/a) [bad](javascript:alert(1))');assert.deepEqual(tokens.filter(t=>t.kind==='link'),[{kind:'link',text:'safe',href:'https://example.org/a'}]);assert.ok(tokens.some(t=>t.kind==='text'&&t.text.includes('javascript:')));
});
test('reading inventory is independent of certified publication, filters retained historical source and refuses duplicates',()=>{
 const records=[{id:'15.02.04',source:'historic'},{id:'09.02.01',source:'draft'},{id:'27.01.01',source:'draft'}];assert.deepEqual(readingInventory(records,['15.02.04']).map(r=>r.id),['09.02.01','27.01.01']);assert.throws(()=>readingInventory([...records,records[0]],[]),/Invalid reading inventory/);assert.throws(()=>readingInventory([{id:'../x'}],[]));
});
test('unclosed fence retains literal code and oversized source fails closed',()=>{
 assert.deepEqual(parseReading(fence+'sql\nSELECT 1;'),[{kind:'code',language:'sql',text:'SELECT 1;'}]);assert.throws(()=>parseReading('x'.repeat(256*1024+1)),/oversized/);
});
