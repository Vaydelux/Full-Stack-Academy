import test from 'node:test';
import assert from 'node:assert/strict';
import { createStudyPlan } from '../src/lib/academy/study-plan.ts';

const catalog = [
  {id:'01.01.01',title:'A',moduleId:'01.01',minutes:20},
  {id:'01.01.02',title:'B',moduleId:'01.01',minutes:30,prerequisites:['01.01.01']},
  {id:'01.01.03',title:'C',moduleId:'01.01',minutes:15,prerequisites:['01.01.02']},
  {id:'02.01.01',title:'D',moduleId:'02.01',minutes:45},
];
const empty = () => ({complete:{},quizzes:{},rubrics:{},notes:{},reflections:{}});

test('plans topologically without claiming it completed prerequisites', () => {
 const progress=empty();
 const result=createStudyPlan(catalog,progress,{budgetMinutes:65});
 assert.deepEqual(result.lessons.map(l=>l.id),['01.01.01','01.01.02','01.01.03']);
 assert.equal(result.totalMinutes,65);
 assert.deepEqual(progress.complete,{});
});

test('prefers an in-progress lesson over untouched eligible lessons', () => {
 const progress={...empty(),notes:{'02.01.01':'draft'}};
 const result=createStudyPlan(catalog,progress,{budgetMinutes:60});
 assert.deepEqual(result.lessons.map(l=>l.id),['02.01.01']);
});

test('a prerequisite outside the focus remains mandatory and blocks planning',()=>{
 const result=createStudyPlan(catalog,empty(),{budgetMinutes:120,focusModule:'01.01',maxLessons:4});
 assert.deepEqual(result.lessons.map(l=>l.id),['01.01.01','01.01.02','01.01.03']);
 const onlyNext=createStudyPlan(catalog,{...empty(),complete:{'01.01.01':true}}, {budgetMinutes:120,focusModule:'01.01'});
 assert.equal(onlyNext.lessons[0].id,'01.01.02');
 const blocked=createStudyPlan([{id:'x',title:'x',moduleId:'x',minutes:10,prerequisites:['missing']}],empty(),{budgetMinutes:30});
 assert.equal(blocked.lessons.length,0);
 assert.equal(blocked.blockedInScope,1);
});

test('skips large eligible lessons when a smaller one fits, unless first lesson is oversized',()=>{
 const result=createStudyPlan(catalog,empty(),{budgetMinutes:40});
 assert.deepEqual(result.lessons.map(l=>l.id),['01.01.01']);
 assert.equal(result.overBudget,false);
 const oversized=createStudyPlan([catalog[3]],empty(),{budgetMinutes:15});
 assert.equal(oversized.lessons[0].id,'02.01.01');
 assert.equal(oversized.overBudget,true);
});

test('deduplicates IDs, clamps invalid minutes and caps budgets and count',()=>{
 const data=[catalog[0],catalog[0],{id:'bad',title:'bad',moduleId:'01.01',minutes:NaN}];
 const result=createStudyPlan(data,empty(),{budgetMinutes:0,maxLessons:200});
 assert.equal(result.remainingInScope,2);
 assert.equal(result.lessons.length,1);
 assert.equal(result.totalMinutes,20); // first candidate is an intentional stretch beyond the 10-minute minimum budget
 assert.equal(result.overBudget,true);
 const fallback=createStudyPlan(data.slice(2),empty(),{budgetMinutes:30});
 assert.equal(fallback.totalMinutes,15);
});

test('finished scope yields no queue and no false blocker',()=>{
 const progress={...empty(),complete:Object.fromEntries(catalog.map(x=>[x.id,true]))};
 const result=createStudyPlan(catalog,progress,{budgetMinutes:45});
 assert.equal(result.remainingInScope,0);
 assert.equal(result.lessons.length,0);
 assert.equal(result.blockedInScope,0);
});

test('does not bypass a missing or cyclic prerequisite even for started lessons',()=>{
 const cyclic=[
  {id:'a',title:'A',moduleId:'x',minutes:10,prerequisites:['b']},
  {id:'b',title:'B',moduleId:'x',minutes:10,prerequisites:['a']},
 ];
 const result=createStudyPlan(cyclic,{...empty(),notes:{a:'started'}},{budgetMinutes:45});
 assert.equal(result.lessons.length,0);
 assert.equal(result.blockedInScope,2);
});

test('a completed cross-module prerequisite unlocks focused learning',()=>{
 const lessons=[
  {id:'intro',title:'Intro',moduleId:'basics',minutes:5},
  {id:'advanced',title:'Advanced',moduleId:'advanced',minutes:15,prerequisites:['intro']},
 ];
 const blocked=createStudyPlan(lessons,empty(),{budgetMinutes:30,focusModule:'advanced'});
 assert.equal(blocked.lessons.length,0);
 const unlocked=createStudyPlan(lessons,{...empty(),complete:{intro:true}},{budgetMinutes:30,focusModule:'advanced'});
 assert.deepEqual(unlocked.lessons.map(l=>l.id),['advanced']);
});

test('the lesson count bound prevents unbounded lists',()=>{
 const lessons=Array.from({length:30},(_,i)=>({id:String(i),title:String(i),moduleId:'many',minutes:1}));
 const result=createStudyPlan(lessons,empty(),{budgetMinutes:240,maxLessons:500});
 assert.equal(result.lessons.length,12);
 assert.equal(result.totalMinutes,12);
});
