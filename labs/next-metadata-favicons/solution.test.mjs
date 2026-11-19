import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const mod=await import('./'+(process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution')+'/solution.tsx');
test("07.01.07 Metadata and favicons offline data contract",()=>{
assert.deepEqual(mod.metadataForGuide('react'),{title:'React guide | Academy',description:'Learn React guide with practical examples.'});
assert.throws(()=>mod.metadataForGuide('random'),/Unknown guide/);
});
