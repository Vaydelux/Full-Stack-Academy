import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const slugs=["ui-tailwind-v4","ui-css-theme-tokens","ui-radix-dialog","ui-shadcn-adapter","ui-variant-classes","ui-contrast-themes","ui-responsive-nav","ui-component-gallery","ui-motion-reduced","ui-modal-accessibility","ui-combobox-filter","ui-focus-loop","ui-toast-queue","ui-reorder-keyboard","ui-chart-summary","ui-dropdown-bug-hunt","ui-table-columns","ui-controlled-table","ui-virtual-window","ui-mobile-table-view","ui-table-empty-error","ui-optimistic-table","ui-safe-csv-export","ui-operational-console","ui-visual-rhythm","ui-color-type-system","ui-form-error-contract","ui-heuristic-severity","ui-reduced-motion-audit","ui-browser-coverage","ui-cls-reserved-space","ui-ux-audit-capstone"];
test('every UI Systems starter fails a substantive local assertion',{timeout:800000},()=>{
 for(const slug of slugs){
  const result=spawnSync(process.execPath,['--import','tsx','--test','--test-reporter=tap','labs/'+slug+'/solution.test.mjs'],{
   cwd:root,env:{...process.env,NODE_TEST_CONTEXT:undefined,ACADEMY_LAB_TARGET:'starter'},encoding:'utf8',timeout:25000
  });
  assert.equal(result.error,undefined,slug+' cannot execute runner');
  assert.notEqual(result.status,0,slug+' starter unexpectedly passed');
  assert.match(result.stdout||'',/not ok\s+\d+/,slug+' must fail an assertion, not just fail to import');
  assert.match(result.stdout||'',/code:\s*['"]ERR_ASSERTION['"]/,slug+': expected AssertionError, not import/transform failure');
 }
});
