/** Read-only source-level P1 release overview. Never infer browser qualification. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectFormsQueryPromotion} from './forms-query-promotion-readiness.mjs';
import {inspectQueryPublicationCandidates} from './verify-forms-query-query-candidates.mjs';
import {inspectRHFPublicationCandidates} from './verify-forms-query-rhf-candidates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const flags=new Set(process.argv.slice(2));
if([...flags].some(x=>!['--json','--check'].includes(x)))throw Error('Usage: --json|--check');
const audit=inspectFormsQueryPromotion();
const queryCandidates=inspectQueryPublicationCandidates();
const rhfCandidates=inspectRHFPublicationCandidates();
const checkpoint=JSON.parse(fs.readFileSync(path.join(root,'docs/checkpoint.json'),'utf8'));
const exists=p=>fs.existsSync(path.join(root,p));
const previews=exists('src/content/forms-query-draft-registry.tsx')&&
 exists('src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx')&&
 exists('scripts/forms-query-draft-preview-smoke.mjs');
const each=audit.modules.map(m=>{
 const candidate=m.id==='09.02'?rhfCandidates:queryCandidates;
 const errors=candidate.issues;
 return {
  id:m.id,topics:m.total,staged:m.staged,published:m.published,
  candidatePacks:candidate.candidateCount,
  candidateErrors:errors,
  // Never call a module source-ready when its actual publication bundles fail.
  sourceReady:errors.length===0&&m.blockers.every(b=>!b.startsWith('No valid staged')),
  humanAccessibilityReviewed:m.a11y,
  blockers:m.blockers,
 };
});
const rhf=each.find(m=>m.id==='09.02'),query=each.find(m=>m.id==='09.03');
const next=rhf?.published!==8?
 'Qualify actual Node24, Chromium, published MDX and keyboard/screen-reader/zoom checks for RHF 09.02 first':
 query?.published!==8?
 'RHF is published: qualify TanStack Query 09.03 including Next SSR and independent human accessibility':
 'P1 09.02 and 09.03 are published: independently qualify the next P2 module';
const output={
 program:'P1 — Forms and remote state',
 date:checkpoint.updatedAt,
 claimedRuntimeOrA11yExecution:false,
 rhfCandidatePacks:rhfCandidates.candidateCount,
 rhfCandidateSourceErrors:rhfCandidates.issues,
 queryCandidatePacks:queryCandidates.candidateCount,
 queryCandidateSourceErrors:queryCandidates.issues,
 queryRuntimeBrowserQualified:false,
 previewSourcesPresent:previews,
 publicationSnapshot:audit.snapshot,
 modules:each,
 structuralErrors:[...audit.sourceErrors,
  ...rhfCandidates.issues.map(x=>({...x,moduleId:'09.02'})),
  ...queryCandidates.issues.map(x=>({...x,moduleId:'09.03'}))],
 note:'Draft preview routes, content and source contracts are not evidence of a Node24 build, Chromium pass, published lab qualification or human screen-reader review.',
 next,
};
if(flags.has('--json'))console.log(JSON.stringify(output,null,2));
else for(const m of each)console.log(m.id+': '+m.staged+'/'+m.topics+' staged; '+m.published+' published; '+m.blockers.length+' blockers');
if(flags.has('--check')&&(!previews||output.structuralErrors.length||each.some(m=>!m.sourceReady||m.topics!==8)))process.exitCode=1;
