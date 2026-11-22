import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCourseProgress } from '../src/lib/academy/course-progress-model.ts';

const topics=[{id:'11.01.01',moduleId:'11.01'}, {id:'11.01.02',moduleId:'11.01'}, {id:'12.01.01',moduleId:'12.01'}];
const modules=[{id:'11.01',title:'Nest',track:'11'},{id:'12.01',title:'SQL',track:'12'}];
const phases=[{id:'P2',title:'Nest',tracks:['11'],result:'APIs'}, {id:'P3',title:'Postgres',tracks:['12'],result:'SQL'}];
test('published, authored and planned are separate mutually exclusive counts',()=>{
 const report=buildCourseProgress(topics,modules,['11.01.01'],['11.01.02'],phases);
 assert.deepEqual([report.total,report.published,report.drafted,report.toAuthor],[3,1,1,1]);
 assert.deepEqual(report.phases.map(p=>[p.id,p.published,p.drafted,p.toAuthor]),
   [['P2',1,1,0],['P3',0,0,1]]);
});
test('drafts never inflate learner-visible published progress',()=>{
 const report=buildCourseProgress(topics,modules,[],['11.01.01','11.01.02','12.01.01'],phases);
 assert.equal(report.published,0);
 assert.equal(report.drafted,3);
 assert.equal(report.toAuthor,0);
});
test('duplicate, unknown and already published IDs are rejected',()=>{
 assert.throws(()=>buildCourseProgress(topics,modules,['11.01.01'],['11.01.01'],phases),/Draft already published/);
 assert.throws(()=>buildCourseProgress(topics,modules,['11.01.01','11.01.01'],[],phases),/Duplicate published/);
 assert.throws(()=>buildCourseProgress(topics,modules,[],['unknown'],phases),/Noncanonical draft/);
});
test('incomplete modules cannot disappear from the roadmap',()=>{
 assert.throws(()=>buildCourseProgress(topics,modules,[],[],[phases[0]]),/Unassigned unfinished/);
});
test('historically completed modules can remain outside phases',()=>{
 const report=buildCourseProgress(topics,modules,['12.01.01'],[],[phases[0]]);
 assert.equal(report.total,3);
 assert.equal(report.published,1);
});
