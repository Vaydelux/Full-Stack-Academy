import test from 'node:test';
import assert from 'node:assert/strict';
import {findExpressions} from '../scripts/audit-mdx-expressions.mjs';
test('reports executable prose and flow expressions with source positions',()=>{
 assert.deepEqual(findExpressions({children:[{type:'paragraph',children:[{type:'mdxTextExpression',value:'index',position:{start:{line:7}}}]},{type:'mdxFlowExpression',value:'run()'}]}),[{line:7,expression:'index'},{line:null,expression:'run()'}]);
});
test('does not mistake code or component attributes for prose expressions',()=>{
 assert.deepEqual(findExpressions({children:[{type:'inlineCode',value:'key={index}'},{type:'code',value:'{index}'},{type:'mdxJsxFlowElement',attributes:[{type:'mdxJsxAttribute',value:{type:'mdxJsxAttributeValueExpression',value:'1'}}],children:[]}]}),[]);
});
