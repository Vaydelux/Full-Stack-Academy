import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Code ownership — policy regression",()=>{const rules=[{pattern:'*',owner:'@all'},{pattern:'docs/**',owner:'@docs'},{pattern:'docs/security.md',owner:'@security'}];assert.equal(solve('docs/security.md',rules),'@security');assert.equal(solve('docs/intro.md',rules),'@docs');assert.equal(solve('src/index.ts',rules),'@all');});
