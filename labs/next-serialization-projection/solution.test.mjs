import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.03 Serialization boundaries: offline boundary contract",()=>{
const row={id:'c1',title:'React',createdAt:new Date('2026-01-02T00:00:00Z'),internalToken:'NEVER-SEND'};
const dto=mod.toClientCourse(row);
assert.deepEqual(dto,{id:'c1',title:'React',createdAtIso:'2026-01-02T00:00:00.000Z'});
assert.doesNotMatch(JSON.stringify(dto),/NEVER-SEND/);
assert.equal(typeof dto.createdAtIso,'string');
});
