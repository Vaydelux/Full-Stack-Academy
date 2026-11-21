import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {rhfReviewFingerprint} from '../scripts/forms-query-review-fingerprint.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lesson='release-candidates/forms-query/09.02/lessons/09.02.01.mdx';
const lab='release-candidates/forms-query/09.02/labs/forms-query-controlled-uncontrolled/solution/solution.tsx';

test('RHF reviewer fingerprint is a deterministic canonical SHA-256 digest',()=>{
 const original=rhfReviewFingerprint();
 assert.match(original,/^[a-f0-9]{64}$/);
 assert.equal(rhfReviewFingerprint(),original);
 assert.equal(rhfReviewFingerprint({readSource:read}),original);
});
test('changing a reviewed lesson article invalidates the old human review',()=>{
 const digest=rhfReviewFingerprint();
 const modified=rhfReviewFingerprint({readSource:p=>p===lesson?read(p)+'\nNew wording':read(p)});
 assert.notEqual(modified,digest);
});
test('changing a reviewed instructor solution invalidates the old human review',()=>{
 const digest=rhfReviewFingerprint();
 const modified=rhfReviewFingerprint({readSource:p=>p===lab?read(p)+'\n// changed code':read(p)});
 assert.notEqual(modified,digest);
});
test('generated live registries are excluded, keeping review stable across publication',()=>{
 const seen=new Set();
 const digest=rhfReviewFingerprint({readSource:p=>{seen.add(p);return read(p);}});
 assert.match(digest,/^[a-f0-9]{64}$/);
 assert.equal(seen.has('src/content/lesson-registry.tsx'),false);
 assert.equal(seen.has('src/lib/academy/published.ts'),false);
 assert.ok(seen.has(lesson));
 assert.ok(seen.has(lab));
 assert.ok(seen.has('src/app/learn/[lessonId]/page.tsx'));
 assert.ok(seen.has('src/components/course/KnowledgeCheck.tsx'));
});
