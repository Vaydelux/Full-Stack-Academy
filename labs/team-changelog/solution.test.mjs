import test from 'node:test';
import assert from 'node:assert/strict';
const {solve}=await import(new URL('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.mjs',import.meta.url));
test("Changelogs and releases — policy regression",()=>{assert.equal(solve('1.2.0',['feat: add search','fix: repair login','chore: ci tuning']),'## 1.2.0\n### Added\n- add search\n### Fixed\n- repair login\n');assert.equal(solve('1.0.0',[]),'## 1.0.0\n');});
