import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.07 Secret handling and server-only: offline boundary contract",()=>{
const record={id:'u1',displayName:'Ava',apiCredential:'SECRET-NEVER-EXPORT'};
assert.deepEqual(mod.publicIdentity(record),{id:'u1',displayName:'Ava'});
assert.doesNotMatch(JSON.stringify(mod.publicIdentity(record)),/SECRET-NEVER-EXPORT|apiCredential/);
});
