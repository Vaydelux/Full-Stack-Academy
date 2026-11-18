import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Dependency upgrades — offline monorepo policy",()=>{assert.equal(solve('1.2.3','2.0.0'),'major');assert.equal(solve('1.2.3','1.3.0'),'minor');assert.equal(solve('1.2.3','1.2.4'),'patch');assert.equal(solve('2.0.0','1.9.0'),'downgrade');assert.equal(solve('1.2.3','1.2.3'),'unchanged');});
