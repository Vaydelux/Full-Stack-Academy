/** Read-only source-level P1 release overview. Never infer browser qualification. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectFormsQueryPromotion} from './forms-query-promotion-readiness.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const flags=new Set(process.argv.slice(2));
if([...flags].some(x=>!['--json','--check'].includes(x)))throw Error('Usage: --json|--check');
const audit=inspectFormsQueryPromotion();
const exists=p=>fs.existsSync(path.join(root,p));
const previews=exists('src/content/forms-query-draft-registry.tsx')&&
 exists('src/app/learn/projects/forms-query/drafts/[lessonId]/page.tsx')&&
 exists('scripts/forms-query-draft-preview-smoke.mjs');
const each=audit.modules.map(m=>({
 id:m.id,topics:m.total,staged:m.staged,published:m.published,
 sourceReady:m.blockers.every(b=>!b.startsWith('No valid staged')),
 humanAccessibilityReviewed:m.a11y,
 blockers:m.blockers,
}));
const output={
 program:'P1 — Forms and remote state',
 date:'2026-11-20',
 claimedRuntimeOrA11yExecution:false,
 previewSourcesPresent:previews,
 publicationSnapshot:audit.snapshot,
 modules:each,
 structuralErrors:audit.sourceErrors,
 note:'Draft preview routes, content and source contracts are not evidence of a Node24 build, Chromium pass, published lab qualification or human screen-reader review.',
 next:'Qualify real dependencies and 09.02 lab/browser/keyboard/screen-reader gates before publishing eight topics',
};
if(flags.has('--json'))console.log(JSON.stringify(output,null,2));
else for(const m of each)console.log(m.id+': '+m.staged+'/'+m.topics+' staged; '+m.published+' published; '+m.blockers.length+' blockers');
if(flags.has('--check')&&(!previews||audit.sourceErrors.length||each.some(m=>!m.sourceReady||m.topics!==8)))process.exitCode=1;
