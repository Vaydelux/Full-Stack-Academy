import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {findExpressions,audit} from '../scripts/audit-mdx-expressions.mjs';
test('reports executable prose and flow expressions with source positions',()=>{
 assert.deepEqual(findExpressions({children:[{type:'paragraph',children:[{type:'mdxTextExpression',value:'index',position:{start:{line:7}}}]},{type:'mdxFlowExpression',value:'run()'}]}),[{line:7,expression:'index'},{line:null,expression:'run()'}]);
});
test('does not mistake code or component attributes for prose expressions',()=>{
 assert.deepEqual(findExpressions({children:[{type:'inlineCode',value:'key={index}'},{type:'code',value:'{index}'},{type:'mdxJsxFlowElement',attributes:[{type:'mdxJsxAttribute',value:{type:'mdxJsxAttributeValueExpression',value:'1'}}],children:[]}]}),[]);
});

test('MDX audit checks both P1 candidate families before publication',async t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'academy-mdx-audit-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const dirs=['src/content/lessons','drafts/forms-query/lessons','release-candidates/forms-query/09.02/lessons','release-candidates/forms-query/09.03/lessons'];
 for(const dir of dirs){fs.mkdirSync(path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,dir,'fixture.mdx'),dir);}
 const result=await audit(root,async(source,{remarkPlugins})=>{
  const children=source.includes('release-candidates')?[{type:'mdxTextExpression',value:'index',position:{start:{line:1}}}]:[];
  for(const plugin of remarkPlugins)plugin()({type:'root',children});
 });
 assert.equal(result.filesScanned,4);
 assert.deepEqual(result.findings.map(f=>f.file).sort(),dirs.slice(2).map(dir=>path.join(dir,'fixture.mdx')).sort());
});
