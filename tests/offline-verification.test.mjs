import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const script=fs.readFileSync(path.join(root,'scripts/verify-offline.mjs'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
test('offline quality gate invokes required local checks, without cloud deployment actions',()=>{
 assert.equal(pkg.scripts['verify:offline'],'node scripts/verify-offline.mjs');
 for(const name of ['lint','typecheck','test','validate','verify:content','checkpoint:check','test:labs','test:red-react','test:react-red-advanced','test:red-react-performance','test:red-next-router','test:red-next-full','test:red-ui-track','build']){
  assert.ok(script.includes("'"+name+"'"),name);
 }
 assert.match(script,/spawnSync\(command, args/);
 assert.match(script,/if \(result.error \|\| result.status !== 0\)/);
 assert.doesNotMatch(script,/mcp__GitHub__|vercel\.deploy|workflow_dispatch|gh workflow/i);
});
