/** Immutable review fingerprint for RHF 09.02.
 * Covers source learners actually see, run, and test. Intentionally excludes
 * the two generated live registries: the promotion changes those files, not
 * the reviewed lesson source. Human review must still be performed honestly.
 */
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=Array.from({length:8},(_,i)=>'09.02.'+String(i+1).padStart(2,'0'));
const base='release-candidates/forms-query/09.02';

export function rhfReviewFingerprint({readSource=read}={}){
 const shared=[
  'examples/forms-query-vertical/react-client/src/api.ts',
  'examples/forms-query-vertical/react-client/src/policy.ts',
  'tests/forms-query-response-contract.test.mjs',
  'src/content/forms-query-draft-registry.tsx',
  'src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx',
  'src/app/learn/projects/forms-query/page.tsx',
  'src/app/learn/[lessonId]/page.tsx',
  'src/components/course/DocShell.tsx',
  'src/components/course/DocNavigation.tsx',
  'src/components/course/CopyCodeButton.tsx',
  'src/lib/academy/lesson-neighbors.mjs',
  'mdx-components.tsx',
  'src/app/globals.css',
  'src/components/course/LessonBlocks.tsx',
  'src/components/course/KnowledgeCheck.tsx',
  'scripts/verify-rhf-release-browser.mjs',
  'scripts/verify-forms-query-staged-rhf.mjs',
  'scripts/forms-query-release-article.mjs'
 ];
 const items=ids.flatMap(id=>{
  const slug=JSON.parse(readSource('drafts/forms-query/lessons/'+id+'.meta.json')).labSlug;
  const lab='forms-query-'+slug;
  return [
   base+'/lessons/'+id+'.mdx',
   base+'/lessons/'+id+'.meta.json',
   base+'/labs/'+lab+'/lab.json',
   base+'/labs/'+lab+'/starter/solution.tsx',
   base+'/labs/'+lab+'/solution/solution.tsx',
   base+'/labs/'+lab+'/solution.test.mjs'
  ];
 });
 const sha=createHash('sha256');
 for(const item of [...new Set([...shared,...items])].sort()){
  sha.update(item+'\0');
  sha.update(readSource(item));
  sha.update('\0');
 }
 return sha.digest('hex');
}
