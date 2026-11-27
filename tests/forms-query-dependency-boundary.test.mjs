import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('nested real npm lock authenticates the teaching React dependencies',()=>{
 const pkg=json('examples/forms-query-vertical/react-client/package.json');
 const lock=json('examples/forms-query-vertical/react-client/package-lock.json');
 const versions=json('content/stack-versions.json');
 assert.equal(versions.reactHookForm,'7');
 assert.equal(versions.tanstackQuery,'5');
 for(const dep of ['react-hook-form','@hookform/resolvers','@tanstack/react-query']){
  assert.equal(lock.packages[''].dependencies[dep],pkg.dependencies[dep]);
  assert.ok(/^sha512-/.test(lock.packages['node_modules/'+dep].integrity));
 }
});
test('published teaching code fences do not require runtime dependencies in root Next',()=>{
 const pkg=json('package.json');
 const mdxIds=Array.from({length:16},(_,i)=>(i<8?'09.02.':'09.03.')+String(i%8+1).padStart(2,'0'));
 for(const dep of ['react-hook-form','@hookform/resolvers','@tanstack/react-query']){
  assert.equal(pkg.dependencies[dep],undefined,'Unexpected root dependency: '+dep);
 }
 for(const id of mdxIds){
  const content=read('drafts/forms-query/lessons/'+id+'.mdx');
  const imports=content.split('\n\n',1)[0].split('\n').filter(l=>l.startsWith('import '));
  assert.equal(imports.length,2,id+' imports a runtime module');
  assert.ok(imports.every(l=>l.includes("@/components/course/")),id+' has untrusted imports');
 }
});
test('publication audit requires the nested trust boundary rather than root dependency bloat',()=>{
 const source=read('scripts/forms-query-promotion-readiness.mjs');
 assert.doesNotMatch(source,/blockers\.push\('Root runtime missing/);
 assert.match(source,/Nested npm lock does not match or authenticate/);
 assert.match(source,/node_modules\/['"]\+dep/);
});

test('root application compiler excludes independent staged teaching labs without weakening strictness',()=>{
 const config=json('tsconfig.json');
 assert.equal(config.compilerOptions.strict,true);
 for(const directory of ['drafts/forms-query','release-candidates/forms-query','examples/forms-query-vertical/react-client']) assert.ok(config.exclude.includes(directory),directory);
 assert.ok(config.include.includes('**/*.tsx'));
 const scripts=json('package.json').scripts;
 for(const gate of ['qualify:forms-query:rhf-browser','qualify:forms-query:query-browser','test:forms-query-rhf-candidates','test:forms-query-query-candidates']) assert.ok(scripts[gate],gate);
});

test('dynamic field array prose renders the React key as literal inline code',()=>{
 const source=read('drafts/forms-query/lessons/09.02.04.mdx');
 const prose=source.split('\n').filter(line=>/^(?:\*\*What breaks|1\. \*\*Reproduce)/.test(line));
 assert.equal(prose.length,2);
 for(const line of prose) assert.ok(line.includes('`key={index}`'));
});

test('published standalone lab files remain outside Next but inside strict nested typechecking',()=>{
 const app=json('tsconfig.json');
 const nested=json('examples/forms-query-vertical/react-client/tsconfig.json');
 const teaching=json('examples/forms-query-vertical/react-client/tsconfig.staged.json');
 assert.equal(app.compilerOptions.strict,true);
 assert.equal(nested.compilerOptions.strict,true);
 assert.equal(teaching.extends,'./tsconfig.json');
 assert.ok(app.exclude.includes('labs/forms-query-*/**/*'));
 assert.ok(teaching.include.includes('../../../labs/forms-query-*/**/*.tsx'));
 assert.ok(teaching.include.includes('../../../drafts/forms-query/labs/**/*.tsx'));
 for(const dep of ['react-hook-form','@hookform/resolvers/zod','@tanstack/react-query'])assert.ok(teaching.compilerOptions.paths[dep]?.[0].startsWith('./node_modules/'),dep);
 for(const [file,runner] of [['scripts/promote-forms-query-rhf.mjs','run'],['scripts/promote-forms-query-query.mjs','exec']]){
  const source=read(file);
  const checkpoint=source.indexOf(runner+"('npm',['run','checkpoint:write']");
  const nestedCheck=source.indexOf(runner+"('npm',['run','typecheck:staged','--prefix','examples/forms-query-vertical/react-client'])");
  const build=source.indexOf(runner+"('npm',['run','build']",checkpoint);
  assert.ok(checkpoint>=0&&nestedCheck>checkpoint&&build>nestedCheck,'Published sources must be typechecked before build: '+file);
 }
});
