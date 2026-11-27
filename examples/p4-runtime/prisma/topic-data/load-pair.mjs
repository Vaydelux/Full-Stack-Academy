import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {createHash} from 'node:crypto';
const slugs=['scoped-prisma-reads','safe-prisma-projections','scoped-prisma-writes','transactional-prisma-transfer','safe-prisma-cursor','map-prisma-constraint-errors','batch-prisma-relations','tenant-scoped-repository-lab'];
const declarations=['getTask','listTasks','renameTask',null,null,null,null,'listProjectTasks'];
const args=['','','','db,tenantId,fromId,toId,amount','db,tenantId,pageSize,afterId,page','createTask','db,tenantId',''];
export async function loadPair(n){
 assert.ok(Number.isInteger(n)&&n>=1&&n<=8);
 const slug=slugs[n-1],base=new URL('../../../../drafts/p4/labs/'+slug+'/',import.meta.url);
 const lesson=new URL('../../../../drafts/p4/lessons/13.02.0'+n+'.mdx',import.meta.url);
 const mdx=readFileSync(lesson,'utf8').replaceAll('\r\n','\n');
 const fence=String.fromCharCode(96).repeat(3);
 const fences=[...mdx.matchAll(new RegExp(fence+'ts\\n([\\s\\S]*?)\\n'+fence,'g'))].map(m=>m[1].trim());
 const bodies=['starter','solution'].map(k=>readFileSync(new URL(k+'.ts',base),'utf8').replaceAll('\r\n','\n'));
 assert.deepEqual(fences,bodies.map(b=>b.trim()),'Lesson snippet drift');
 const acceptance=readFileSync(new URL('acceptance.md',base),'utf8');
 assert.ok(acceptance.startsWith('# 13.02.0'+n+':'));
 const funcs=await Promise.all(bodies.map(async (body,i)=>{
  const name=declarations[n-1];
  const source=name?(body.startsWith('export ')?body:'export '+body)+'\nexport default '+name+';\n':
   'export default async function exercise('+args[n-1]+'){\n'+body+(n===7&&i===0?'\nreturn projects;\n':'')+'\n}';
  const js=stripTypeScriptTypes(source,{mode:'strip'});
  return (await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'))).default;
 }));
 return {red:funcs[0],green:funcs[1],sourceDigest:createHash('sha256').update(JSON.stringify([mdx,...bodies,acceptance])).digest('hex')};
}
