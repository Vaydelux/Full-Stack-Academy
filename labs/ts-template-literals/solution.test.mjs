import test from 'node:test';
import assert from 'node:assert/strict';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.ts',import.meta.url));
test("Template literal types — type-safe runtime semantics",async()=>{assert.equal(solve('course:css'),true);assert.equal(solve('topic:layout'),true);assert.equal(solve('admin:any'),false);assert.equal(solve('course:'),false);assert.equal(solve('a:b'),false);});
