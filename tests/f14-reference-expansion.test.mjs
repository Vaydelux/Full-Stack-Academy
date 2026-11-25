import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AUTHORED_REFERENCES} from '../src/lib/academy/authored-content.ts';
import {validateReferenceDrafts,referenceCoverage} from '../scripts/reference-quality.mjs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const ids=[
  "web-button",
  "web-form",
  "web-input",
  "web-fieldset",
  "web-dialog",
  "web-details",
  "web-img",
  "web-a",
  "web-urlsearchparams",
  "web-abortcontroller",
  "css-display",
  "css-position",
  "css-z-index",
  "css-box-sizing",
  "css-flex",
  "css-gap",
  "css-has",
  "css-transition",
  "javascript-const",
  "javascript-let",
  "javascript-async",
  "javascript-await",
  "javascript-array-map",
  "javascript-array-filter",
  "javascript-array-reduce",
  "javascript-array-find",
  "javascript-map",
  "javascript-set",
  "javascript-json-parse",
  "javascript-json-stringify",
  "typescript-unknown",
  "typescript-keyof",
  "typescript-typeof",
  "typescript-satisfies",
  "typescript-partial",
  "typescript-pick",
  "typescript-omit",
  "typescript-record",
  "typescript-returntype",
  "typescript-awaited",
  "react-key",
  "react-usememo",
  "react-usecallback",
  "react-usedeferredvalue",
  "react-suspense",
  "next.js-page-tsx",
  "next.js-layout-tsx",
  "next.js-loading-tsx",
  "next.js-route-ts",
  "next.js-dynamic-segments",
  "next.js-link"
];
test('F14 authored batch has complete source fields and exact canonical mappings',()=>{
 const index=json('data/reference-index.json').entries, lessons=json('data/curriculum.json').lessons;
 const batch=AUTHORED_REFERENCES.filter(ref=>ids.includes(ref.id));
 assert.equal(batch.length,ids.length);
 assert.equal(validateReferenceDrafts(batch,index,lessons),ids.length);
 const coverage=referenceCoverage(index,AUTHORED_REFERENCES.map(ref=>ref.id));
 assert.equal(coverage.reduce((n,row)=>n+row.authored,0),json('docs/checkpoint.json').snapshot.authoredReferenceDrafts);
 assert.equal(coverage.reduce((n,row)=>n+row.indexed,0),index.length);
});
