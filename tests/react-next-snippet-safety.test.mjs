// Local source safety regression tests: these check documented fail-closed examples,
// not real authentication, persistence, effect execution or browser interaction.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('private Next handler denies by default without a configured auth verifier',()=>{
 const code=read('labs/next-auth-cache-leak/example.tsx');
 assert.match(code,/async function verifyAuthorizedSession\([^)]*\):Promise<boolean>\{return false;\}/);
 assert.match(code,/if\(!await verifyAuthorizedSession\(token\)\)/);
 assert.match(code,/Cache-Control':'private, no-store/);
 assert.doesNotMatch(code,/if\(!session\).*Authenticated boundary reached/);
});
test('publish sample only invalidates cache after successful persistence',()=>{
 const code=read('labs/next-publish-revalidate/example.tsx');
 const successGate=code.indexOf('if(!persisted)return {ok:false}');
 const invalidate=code.indexOf("updateTag('catalog:academy')");
 assert.ok(successGate>=0&&invalidate>successGate,'Cache invalidation must happen after persistence gate');
 assert.match(code,/persistAuthorizedDraft\(_title:string\):Promise<boolean>\{return false;\}/);
});
test('React room Effect has a meaningful document title cleanup',()=>{
 const code=read('labs/react-effect-sync/solution/Widget.tsx');
 assert.match(code,/const oldTitle=document\.title/);
 assert.match(code,/return\(\)=>\{document\.title=oldTitle/);
});
test('React keyboard shortcut leaves native buttons and form fields alone',()=>{
 const code=read('labs/react-timer-shortcut/solution/Widget.tsx');
 assert.match(code,/e\.repeat\|\|e\.altKey\|\|e\.ctrlKey\|\|e\.metaKey/);
 assert.match(code,/input,textarea,select,button,a,\[contenteditable\]/);
 assert.match(code,/removeEventListener\('keydown',listener\)/);
});
test('JSON-LD lesson escapes script-breaking less-than characters',()=>{
 const code=read('labs/next-json-ld/solution/solution.ts');
 assert.match(code,/replace\(\/<\/g/);
 assert.match(code,/u003c/);
 assert.match(code,/JSON\.stringify\(value\)/);
});
