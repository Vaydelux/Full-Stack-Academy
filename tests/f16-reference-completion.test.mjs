import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {AUTHORED_REFERENCES} from '../src/lib/academy/authored-content.ts';
import {validateReferenceDrafts,referenceCoverage} from '../scripts/reference-quality.mjs';
import {buildReferenceLinks,relatedReferences,relatedCurriculum} from '../scripts/reference-links.mjs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const index=json('data/reference-index.json').entries,lessons=json('data/curriculum.json').lessons;
const ids=new Set([
  "web-html-document",
  "web-html",
  "web-head",
  "web-meta",
  "web-link",
  "web-script",
  "web-article",
  "web-section",
  "web-nav",
  "web-aside",
  "web-picture",
  "web-aria-label",
  "web-tabindex",
  "web-request",
  "web-response",
  "web-url",
  "web-localstorage",
  "web-indexeddb",
  "web-service-worker",
  "web-cors",
  "web-csp",
  "css-min",
  "css-max",
  "css-font-display",
  "css-contain",
  "css-content-visibility",
  "css-animation",
  "javascript-promise",
  "javascript-object-entries",
  "javascript-try-catch",
  "javascript-throw",
  "javascript-import",
  "javascript-export",
  "javascript-eventtarget",
  "javascript-addeventlistener",
  "javascript-queuemicrotask",
  "javascript-structuredclone",
  "javascript-abortsignal",
  "typescript-type",
  "typescript-interface",
  "typescript-never",
  "typescript-union",
  "typescript-intersection",
  "typescript-infer",
  "typescript-as-const",
  "typescript-type-guards",
  "typescript-tsconfig-strict",
  "typescript-nodenext",
  "react-jsx",
  "react-component",
  "react-props",
  "react-children",
  "react-uselayouteffect",
  "react-error-boundaries",
  "react-context",
  "react-custom-hooks",
  "react-react-memo",
  "next.js-error-tsx",
  "next.js-not-found-tsx",
  "next.js-route-groups",
  "next.js-generatemetadata",
  "next.js-generatestaticparams",
  "next.js-server-components",
  "next.js-client-components",
  "next.js-server-actions",
  "next.js-use-cache",
  "next.js-cachetag",
  "next.js-revalidatetag",
  "next.js-redirect",
  "next.js-notfound",
  "next.js-cookies",
  "next.js-headers",
  "next.js-image",
  "next.js-fetch-caching",
  "next.js-next-js-proxy",
  "nestjs-fastifyadapter",
  "nestjs-bullmodule",
  "nestjs-websocketgateway",
  "nestjs-terminus-health",
  "postgresql-offset",
  "postgresql-explain-analyze",
  "postgresql-jsonb",
  "postgresql-pg-trgm",
  "postgresql-gin-index",
  "prisma-id",
  "prisma-default",
  "prisma-unique",
  "prisma-index",
  "prisma-enum",
  "prisma-where",
  "prisma-orderby",
  "prisma-prismaclient",
  "prisma-prisma-migrate",
  "prisma-prisma-config-ts",
  "supabase-createbrowserclient",
  "supabase-createserverclient",
  "supabase-signinwithoauth",
  "supabase-createsigneduploadurl",
  "supabase-realtime-channel",
  "supabase-broadcast",
  "supabase-presence",
  "redis-eval",
  "redis-redis-persistence",
  "redis-eviction",
  "redis-job",
  "redis-flows",
  "redis-repeatable-jobs",
  "redis-queueevents",
  "testing-k6-check",
  "testing-github-actions-job",
  "testing-opentelemetry-span",
  "testing-sentry-event",
  "testing-adr",
  "testing-csp",
  "testing-owasp-asvs"
]);
test('F16 closes every canonical reference gap without introducing duplicate or extra IDs',()=>{
 assert.equal(index.length,303);
 assert.equal(AUTHORED_REFERENCES.length,index.length);
 assert.deepEqual(new Set(AUTHORED_REFERENCES.map(x=>x.id)),new Set(index.map(x=>x.id)));
 for(const row of referenceCoverage(index,AUTHORED_REFERENCES.map(x=>x.id)))assert.equal(row.remaining,0,row.category);
});
test('all 115 new drafts satisfy the quality gate',()=>{
 const batch=AUTHORED_REFERENCES.filter(ref=>ids.has(ref.id));
 assert.equal(batch.length,115);
 assert.equal(validateReferenceDrafts(batch,index,lessons),115);
});
test('entire encyclopedia retains valid reversible lesson links and draft state',()=>{
 const graph=buildReferenceLinks(index,AUTHORED_REFERENCES,lessons);
 for(const ref of AUTHORED_REFERENCES){
  assert.equal(ref.status,'Authored reference draft');
  const linked=relatedCurriculum(graph,lessons,ref.id);
  assert.ok(linked.length,ref.id);
  for(const lesson of linked)assert.ok(relatedReferences(graph,index,lesson.id).some(x=>x.id===ref.id&&x.authored),ref.id);
 }
 const snapshot=json('docs/checkpoint.json').snapshot;
 assert.equal(snapshot.authoredReferenceDrafts,303);
 assert.ok(snapshot.publishedLessons>=338,'Published lesson baseline regressed');
 assert.ok(snapshot.authoredMdxLessons>=337,'MDX lesson baseline regressed');
 // Reference authorship cannot fabricate lesson publication. Recompute the
 // checkpoint from actual lesson metadata, interactive IDs and lab manifests.
 execFileSync(process.execPath,['scripts/checkpoint-status.mjs','--check'],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8',timeout:30000});
});
