/** SHA-256 of exact Query 09.03 content, tests and UI reviewed by a real person. */
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=Array.from({length:8},(_,i)=>'09.03.'+String(i+1).padStart(2,'0'));
export function queryReviewFingerprint({readSource=read}={}){
 const shared=[
  'src/app/learn/[lessonId]/page.tsx',
  'src/app/learn/projects/forms-query/page.tsx',
  'src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx',
  'src/components/course/LessonBlocks.tsx',
  'src/components/course/KnowledgeCheck.tsx',
  'scripts/verify-query-release-browser.mjs',
  'scripts/verify-forms-query-staged-query.mjs',
  'scripts/verify-forms-query-staged-ssr.mjs',
  'scripts/forms-query-query-release-article.mjs'
 ];
 const paths=ids.flatMap(id=>{
  const slug=JSON.parse(readSource('drafts/forms-query/lessons/'+id+'.meta.json')).labSlug;
  const base='release-candidates/forms-query/09.03/labs/forms-query-'+slug;
  return [
   'release-candidates/forms-query/09.03/lessons/'+id+'.mdx',
   'release-candidates/forms-query/09.03/lessons/'+id+'.meta.json',
   base+'/lab.json',base+'/starter/solution.tsx',base+'/solution/solution.tsx',
   base+'/solution.test.mjs',
   ...(slug==='ssr-hydration'?
    ['starter/providers.tsx','starter/task-list.tsx','solution/providers.tsx','solution/task-list.tsx'].map(p=>base+'/'+p):[])
  ];
 });
 const sha=createHash('sha256');
 for(const p of [...new Set([...shared,...paths])].sort()){
  sha.update(p+'\0');sha.update(readSource(p));sha.update('\0');
 }
 return sha.digest('hex');
}
