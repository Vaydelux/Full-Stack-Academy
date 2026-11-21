/** Real browser-backed red/green acceptance for form-state-bug-hunt.
 * This is staged: not executed and not published by committing this file.
 * The module runner uses ephemeral loopback ports to avoid test concurrency.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';

test('RHF form-state-bug-hunt: instructor passes and learner starter fails', {timeout: 120000}, ()=>{
 const result=spawnSync(process.execPath,
  ['scripts/verify-rhf-release-browser.mjs','--lab','form-state-bug-hunt'],
  {cwd:process.cwd(),env:process.env,encoding:'utf8',timeout:105000,maxBuffer:1024*1024}
 );
 assert.ifError(result.error);
 assert.equal(result.status,0,
  'Real RHF browser acceptance failed:\n'+(result.stderr??'')+'\n'+(result.stdout??''));
 assert.match(result.stdout,/"status": "RHF browser acceptance passed"/);
 assert.match(result.stdout,/"assertions": "solution-pass and deliberate-starter-fail"/);
});
