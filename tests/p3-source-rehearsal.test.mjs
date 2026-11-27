import test from 'node:test';
import assert from 'node:assert/strict';
import {sqlLabTimeout,nestLabEnvironment} from '../scripts/pg-lab-policy.mjs';
import {appendReviewProjection} from '../scripts/p3-source-rehearsal.mjs';

test('24 guarded SQL lab paths receive bounded matching timeouts',()=>{
 for(let m=1;m<=3;m++)for(let t=1;t<=8;t++)assert.equal(sqlLabTimeout('labs/postgresql-12-0'+m+'-0'+t+'/solution.test.mjs'),m===3?150000:60000);
});
test('unqualified mixed modules and malformed paths cannot enter SQL runner',()=>{
 for(const p of ['labs/postgresql-12-04-01/solution.test.mjs','labs/postgresql-12-05-08/solution.test.mjs','labs/postgresql-12-03-09/solution.test.mjs','../labs/postgresql-12-03-01/solution.test.mjs','labs/persistence-12-03-01/solution.test.mjs'])assert.throws(()=>sqlLabTimeout(p),/Invalid published/);
});
test('chained overlay may update shared registries but cannot overwrite predecessor source',()=>{
 const old=new Map([['package.json','old'],['labs/first/solution.sql','one']]);
 const next=new Map([['package.json','new'],['labs/second/solution.sql','two']]);
 assert.deepEqual([...appendReviewProjection(old,next)],[['package.json','new'],['labs/first/solution.sql','one'],['labs/second/solution.sql','two']]);
 assert.equal(old.get('package.json'),'old');
 assert.throws(()=>appendReviewProjection(old,new Map([['labs/first/solution.sql','one']])),/overwrite/);
});

test('mixed lab environment selects only the separate Nest connection without mutating SQL input',()=>{
 const env={PG_TEST_URL:'postgres://sql:secret@127.0.0.1:5432/academy_test_sql',ACADEMY_NEST_PG_TEST_URL:'postgres://nest:secret@127.0.0.1:5432/academy_test_nest'};
 assert.equal(nestLabEnvironment(env,true).PG_TEST_URL,env.ACADEMY_NEST_PG_TEST_URL);
 assert.match(env.PG_TEST_URL,/academy_test_sql$/);
 assert.equal(nestLabEnvironment({},false).PG_TEST_URL,undefined);
 for(const value of [undefined,env.PG_TEST_URL,'postgres://nest:secret@localhost:5432/academy_test_nest','postgres://nest:secret@127.0.0.1:5432/production'])assert.throws(()=>nestLabEnvironment({...env,ACADEMY_NEST_PG_TEST_URL:value},true));
});
