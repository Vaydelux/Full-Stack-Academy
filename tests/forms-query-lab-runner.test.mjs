import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'scripts/run-local-labs.mjs'),'utf8');

test('regular offline labs retain batches of twenty for Windows argv safety',()=>{
 assert.match(source,/const batchSize=20/);
 assert.match(source,/for\(let i=0;i<files\.length;i\+=batchSize\)/);
 assert.match(source,/spawnSync\(process\.execPath,\['--import','tsx','--test',\.\.\.batch\]/);
});
test('browser-backed labs run sequentially after cheap suites',()=>{
 assert.match(source,/const browserFiles=\[\]/);
 assert.match(source,/manifest\.runtime\.includes\('browser'\)/);
 assert.match(source,/for\(const file of browserFiles\)/);
 assert.match(source,/spawnSync\(process\.execPath,\['--import','tsx','--test',file\]/);
 assert.match(source,/timeout:180000/);
});
