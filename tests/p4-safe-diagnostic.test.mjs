import test from 'node:test';
import assert from 'node:assert/strict';
import {failureLocation,safeNestedDiagnostic} from '../scripts/p4-safe-diagnostic.mjs';
test('only source locations survive secret-bearing errors',()=>{
 const d=failureLocation({status:1,stderr:'Error: secret=synthetic-token\n at run (file:///tmp/repo/examples/p4-runtime/supabase/live.mjs:51:6)\n at f (file:///tmp/repo/scripts/qualify-p4-evidence.mjs:2:9)\n at token (file:///private/secret.mjs:9:1)'});
 assert.deepEqual(d,{exit:1,interrupted:false,frames:['examples/p4-runtime/supabase/live.mjs:51:6','scripts/qualify-p4-evidence.mjs:2:9']});
 assert.deepEqual(safeNestedDiagnostic('P4_CHILD_DIAGNOSTIC '+JSON.stringify(d)),d);
 assert.equal(safeNestedDiagnostic('P4_CHILD_DIAGNOSTIC '+JSON.stringify({...d,frames:['secret-token']})),null);
 assert.equal(safeNestedDiagnostic('P4_CHILD_DIAGNOSTIC '+JSON.stringify({...d,frames:['examples/p4-runtime/supabase/live.mjs:1:1?token=secret']})),null);
});
