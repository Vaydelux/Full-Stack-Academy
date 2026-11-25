import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCurriculumAccess, curriculumNeighbors, curriculumPrerequisites, filterCurriculumAccess } from '../scripts/curriculum-access.mjs';

const topics = [{id:'09.01.08',moduleId:'09.01',title:'Last published'},{id:'09.02.01',moduleId:'09.02',title:'Read next'},{id:'09.02.02',moduleId:'09.02',title:'Planned'},{id:'10.01.01',moduleId:'10.01',title:'Later published'}];
const catalog = () => buildCurriculumAccess(topics,['09.01.08','10.01.01'],['09.02.01']);
test('all canonical topics have distinct access states in curriculum order',()=>{
  const result = catalog();
  assert.deepEqual(result.map(x=>x.access),['published','reading','planned','published']);
  assert.deepEqual(result.map(x=>x.id),topics.map(x=>x.id));
  assert.ok(topics.every(x=>!Object.hasOwn(x,'access')));
});
test('navigation crosses module and track boundaries without offering unavailable topics',()=>{
  const rows=catalog();
  assert.equal(curriculumNeighbors(rows,'09.01.08').next.id,'09.02.01');
  assert.equal(curriculumNeighbors(rows,'09.02.01').next.id,'10.01.01');
  assert.equal(curriculumNeighbors(rows,'10.01.01').previous.id,'09.02.01');
  assert.deepEqual(curriculumNeighbors(rows,'09.02.02'),{previous:null,next:null});
  assert.deepEqual(curriculumNeighbors(rows,'unknown'),{previous:null,next:null});
  assert.equal(curriculumNeighbors(rows,'09.01.08').previous,null);
  assert.equal(curriculumNeighbors(rows,'10.01.01').next,null);
});
test('status filtering preserves canonical order and does not mutate catalog',()=>{
  const rows=catalog();
  assert.deepEqual(filterCurriculumAccess(rows,'published').map(x=>x.id),['09.01.08','10.01.01']);
  assert.deepEqual(filterCurriculumAccess(rows,'reading').map(x=>x.id),['09.02.01']);
  assert.deepEqual(filterCurriculumAccess(rows,'planned').map(x=>x.id),['09.02.02']);
  assert.equal(filterCurriculumAccess(rows,'all').length,4);
  assert.equal(rows.length,4);
});
test('prerequisites preserve declared order, remove self and duplicates, ignore unknown IDs',()=>{
  assert.deepEqual(curriculumPrerequisites(catalog(),['09.02.02','unknown','09.01.08','09.01.08','09.02.01'],'09.02.01').map(x=>x.id),['09.02.02','09.01.08']);
});
test('inconsistent canonical or availability sets fail closed',()=>{
  assert.throws(()=>buildCurriculumAccess([...topics,topics[0]],[],[]),/Duplicate canonical/);
  assert.throws(()=>buildCurriculumAccess(topics,['09.01.08','09.01.08'],[]),/Duplicate access/);
  assert.throws(()=>buildCurriculumAccess(topics,[],['unknown']),/Unknown reading/);
  assert.throws(()=>buildCurriculumAccess(topics,['unknown'],[]),/Unknown published/);
  assert.throws(()=>buildCurriculumAccess(topics,['09.01.08'],['09.01.08']),/Overlapping/);
});
