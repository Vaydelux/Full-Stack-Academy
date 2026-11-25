import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('search deployment tracing includes only manuscript and metadata inputs',()=>{
 const config=read('next.config.ts');
 assert.match(config,/'\/search': \['\.\/drafts\/\*\/lessons\/\*\.mdx', '\.\/drafts\/\*\/lessons\/\*\.meta\.json'\]/);
 assert.match(config,/poweredByHeader: false/);
 assert.match(config,/X-Frame-Options.*SAMEORIGIN/);
});
test('failed progress reads cannot silently replace progress or overwrite unreadable storage',()=>{
 const store=read('src/lib/academy/store.ts');
 assert.match(store,/else set\(\{ hydrated: true, storageError: true, storageReadBlocked: true \}\)/);
 assert.match(store,/state\.storageReadBlocked \|\| !savePersisted\(next\)/);
 assert.match(store,/if \(!backupWithinLimit\(raw\)\)/);
 assert.match(read('src/components/course/ProgressStorageSync.tsx'),/if \(!state\.storageError\) state\.hydrate\(\)/);
});
test('sandbox origin and sender checks precede bounded diagnostic processing',()=>{
 const preview=read('src/components/workspace/PreviewPane.tsx');
 assert.ok(preview.indexOf("e.origin !== 'null'")<preview.indexOf('previewDiagnostic(e.data)'));
 assert.match(preview,/sandbox="allow-scripts"/);
 assert.doesNotMatch(preview,/sandbox="[^"]*allow-same-origin/);
});
test('all new milestone regression suites are mandatory in offline matrix',()=>{
 const runner=read('scripts/verify-offline.mjs'),gate=read('scripts/offline-contract.mjs');
 for(const name of ['test:f17-discovery','test:f18','test:f19','test:course-roadmap']){assert.ok(runner.includes("'"+name+"'"));assert.ok(gate.includes("'"+name+"'"));}
});
