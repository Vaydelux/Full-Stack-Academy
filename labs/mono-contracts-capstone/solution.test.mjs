import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const target=process.env.ACADEMY_LAB_TARGET==='starter'?'starter':'solution';
const {solve}=await import(new URL('./'+target+'/solution.mjs',import.meta.url));
test("Lab web API shared contracts monorepo — offline monorepo policy",()=>{assert.deepEqual(solve({id:' A ',qty:3}),{id:'A',qty:3});assert.equal(solve({id:'A',qty:-1}),null);assert.equal(solve(null),null);});

test('capstone workspace fixtures resolve matching package names and workspace dependencies',()=>{
 const workspace=readFileSync(new URL('./'+target+'/pnpm-workspace.yaml',import.meta.url),'utf8');
 assert.match(workspace,/apps\/\*/);assert.match(workspace,/packages\/\*/);
 const turbo=JSON.parse(readFileSync(new URL('./'+target+'/turbo.json',import.meta.url),'utf8'));
 assert.deepEqual(turbo.tasks.build.dependsOn,['^build']);
 const contracts=JSON.parse(readFileSync(new URL('./'+target+'/packages/contracts/package.json',import.meta.url),'utf8'));
 assert.equal(contracts.exports['.'].types,'./dist/index.d.ts');
 for(const app of ['api','web']){const pkg=JSON.parse(readFileSync(new URL('./'+target+'/apps/'+app+'/package.json',import.meta.url),'utf8'));assert.equal(pkg.dependencies['@academy/contracts'],'workspace:*');}
});

test('actual TypeScript API and web share a runtime-checked contract',async()=>{
 const {createItemResponse}=await import(new URL('./'+target+'/apps/api/src/index.ts',import.meta.url));
 const {formatItem}=await import(new URL('./'+target+'/apps/web/src/index.ts',import.meta.url));
 const good=createItemResponse({id:' Part-2 ',qty:3});assert.equal(good.ok,true);assert.deepEqual(good.item,{id:'Part-2',qty:3});assert.equal(formatItem(good.item),'Part-2 × 3');
 const bad=createItemResponse({id:'Part-2',qty:-1});assert.deepEqual(bad,{ok:false,error:'invalid-body'});
 assert.deepEqual(createItemResponse(null),{ok:false,error:'invalid-body'});
});

test('real TypeScript compiler validates every package entry and public types',async()=>{
 const ts=await import('typescript');
 const path=await import('node:path');
 const {fileURLToPath}=await import('node:url');
 const roots=['packages/contracts/src/index.ts','apps/api/src/index.ts','apps/web/src/index.ts'].map(x=>fileURLToPath(new URL('./'+target+'/'+x,import.meta.url)));
 const options={strict:true,noEmit:true,skipLibCheck:true,allowImportingTsExtensions:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler};
 const program=ts.createProgram(roots,options);const errors=ts.getPreEmitDiagnostics(program);
 assert.deepEqual(errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')),[]);
});
