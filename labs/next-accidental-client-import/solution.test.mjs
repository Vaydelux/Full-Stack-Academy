import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.02.08 Bug Hunt accidental client import: offline boundary contract",()=>{
assert.equal(mod.safeClientImport('@/components/Button'),true);
assert.equal(mod.safeClientImport('server-only'),false);
assert.equal(mod.safeClientImport('node:fs'),false);
assert.equal(mod.safeClientImport('@/db/client'),false);
assert.equal(mod.safeClientImport('@/lib/server/secrets'),false);
});
