import test from 'node:test';
import assert from 'node:assert/strict';
import {selectReferences, normalizeReference} from '../src/lib/academy/reference-search.mjs';
const entries = [
  {id:'nest-guard',title:'@UseGuards',category:'NestJS'},
  {id:'nest-canactivate',title:'CanActivate',category:'NestJS'},
  {id:'pg-select',title:'SELECT',category:'PostgreSQL'},
  {id:'pg-on-conflict',title:'ON CONFLICT',category:'PostgreSQL'},
  {id:'prisma-select',title:'select',category:'Prisma'},
  {id:'prisma-transaction',title:'$transaction',category:'Prisma'},
];
const authored=['nest-canactivate','pg-on-conflict','prisma-select'];
const search = options => selectReferences(entries,authored,options).map(e=>e.id);
test('normalizes case and separators',()=>assert.equal(normalizeReference('  @UseGuards / NestJS '),'useguards nestjs'));
test('multi-token search accepts reversed category and title',()=>assert.deepEqual(search({query:'conflict PostgreSQL'}),['pg-on-conflict']));
test('decorator and dollar prefix are searchable',()=>{assert.deepEqual(search({query:'@UseGuards'}),['nest-guard']);assert.deepEqual(search({query:'$transaction'}),['prisma-transaction']);});
test('category and visibility combine',()=>assert.deepEqual(search({category:'NestJS',visibility:'authored'}),['nest-canactivate']));
test('indexed-only excludes authored',()=>assert.deepEqual(search({category:'Prisma',visibility:'indexed'}),['prisma-transaction']));
test('empty search prioritizes authored entries',()=>assert.ok(search({}).slice(0,3).every(id=>authored.includes(id))));
test('exact title outranks weaker authored matches',()=>assert.deepEqual(selectReferences([{id:'a',title:'select fields',category:'Prisma'},{id:'b',title:'select',category:'SQL'}],['a'],{query:'select'}).map(x=>x.id),['b','a']));
test('unmatched term yields no entries',()=>assert.deepEqual(search({query:'nonsense'}),[]));
test('search never mutates source array',()=>{const before=JSON.stringify(entries);search({query:'select'});assert.equal(JSON.stringify(entries),before);});
test('tied titles are deterministic',()=>assert.deepEqual(selectReferences([{id:'z',title:'Same',category:'B'},{id:'a',title:'Same',category:'A'}],[]).map(e=>e.id),['a','z']));
