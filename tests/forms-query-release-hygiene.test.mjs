import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ignore=fs.readFileSync(path.join(root,'.gitignore'),'utf8');
test('generated Vite production output is ignored by Git',()=>{
 assert.match(ignore,/^\/examples\/forms-query-vertical\/react-client\/dist\/$/m);
});
test('temporary Next SSR qualification output is ignored by Git',()=>{
 assert.match(ignore,/^\/examples\/forms-query-vertical\/\.ssr-qualification-\*\/$/m);
});
test('generated browser distribution cannot be silently re-committed',t=>{
 if(!fs.existsSync(path.join(root,'.git'))){t.diagnostic('No .git metadata in exported source: tracked-file check unavailable');return}
 const tracked=execFileSync('git',['ls-files','--',
  'examples/forms-query-vertical/react-client/dist/'],{cwd:root,encoding:'utf8'}).trim();
 assert.equal(tracked,'','Vite dist/ output must not be versioned; git rm -r --cached examples/forms-query-vertical/react-client/dist');
});
test('nested npm-generated React lockfile is committed for reproducible installs',()=>{
 const file=path.join(root,'examples/forms-query-vertical/react-client/package-lock.json');
 assert.ok(fs.existsSync(file),'Missing locked nested React dependencies');
 const lock=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.ok(Number.isInteger(lock.lockfileVersion)&&lock.lockfileVersion>=3);
 const deps=lock.packages?.['']?.dependencies??{};
 for(const name of ['react','react-dom','react-hook-form','@hookform/resolvers','@tanstack/react-query','zod']){
  assert.ok(deps[name],name+' missing from nested lock root');
 }
});
