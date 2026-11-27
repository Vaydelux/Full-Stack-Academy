import test from 'node:test';
import assert from 'node:assert/strict';
import {validateP1HumanEvidence} from '../scripts/p1-human-evidence.mjs';
const sha='a'.repeat(64),today='2026-11-26';
function fixture(moduleId='09.02'){const lessonIds=Array.from({length:8},(_,i)=>moduleId+'.0'+(i+1));return {moduleId,reviewed:true,keyboard:true,zoom200:true,reviewer:'Test Reviewer',screenReader:'NVDA 2026',browser:'Chromium 150',operatingSystem:'Windows 11',date:today,sourceSha256:sha,lessonIds,observations:lessonIds.map(id=>({id,passed:true,keyboard:'Tab reaches all controls in order.',zoom200:'Content reflows at two hundred percent.',screenReader:'Control labels and error status announced.',topicSpecific:'Corrected input updates the visible output.'}))};}
const check=(e,id=e.moduleId)=>validateP1HumanEvidence(e,{moduleId:id,sourceSha256:sha,today});
test('both modules require exact source and complete named observations',()=>{for(const id of ['09.02','09.03']){const e=fixture(id);assert.equal(check(e),e);}});
test('extra duplicate missing or reordered lesson IDs rejected',()=>{for(const mutate of [e=>e.lessonIds.push(e.lessonIds[0]),e=>e.lessonIds.pop(),e=>e.lessonIds.reverse(),e=>e.lessonIds[1]=e.lessonIds[0]]){const e=fixture();mutate(e);assert.throws(()=>check(e));}});
test('placeholder reviewer, missing environment and synthetic approval rejected',()=>{for(const patch of [{reviewer:'TODO reviewer'},{screenReader:'unknown'},{browser:''},{operatingSystem:'example'},{reviewed:false},{keyboard:false},{zoom200:false}])assert.throws(()=>check({...fixture(),...patch}));});
test('invalid future and fixture dates rejected',()=>{for(const date of ['2026-02-30','2026-11-27','2000-01-01','2026-11-25T00:00:00Z'])assert.throws(()=>check({...fixture(),date}));});
test('stale fingerprint or different module rejected',()=>{assert.throws(()=>check({...fixture(),sourceSha256:'b'.repeat(64)}));assert.throws(()=>check(fixture(),'09.03'));});
test('missing, failed, duplicate or placeholder observations rejected',()=>{for(const mutate of [e=>delete e.observations,e=>e.observations.pop(),e=>e.observations[1].id=e.observations[0].id,e=>e.observations[0].passed=false,e=>e.observations[0].keyboard='pending actual human review',e=>e.observations[0].screenReader='']){const e=fixture();mutate(e);assert.throws(()=>check(e));}});
