import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const paths=["tests/react-red-starters.test.mjs","tests/react-advanced-red-starters.test.mjs","tests/react-performance-red-starters.test.mjs","tests/next-router-red-starters.test.mjs","tests/next-full-red-starters.test.mjs","tests/ui-track-red-starters.test.mjs","tests/zod-foundations-red-starters.test.mjs","tests/zustand-state-red-starters.test.mjs"];
test('all red-starter gates require ERR_ASSERTION rather than a generic TAP failure',()=>{
 for(const p of paths){
  const file=fs.readFileSync(path.join(root,p),'utf8');
  assert.ok(file.includes('ERR_ASSERTION'),p+' must distinguish actual assertions from loader failures');
  assert.ok(file.includes('not ok'),p+' must still detect a failing test');
 }
});
