import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { lstatSync, realpathSync } from 'node:fs';
import path from 'node:path';

export const REVIEW_FIXTURE_DATE = '2000-01-01';
export const REVIEW_FIXTURE_STATUS = 'LOCAL-REVIEW-FIXTURE-DO-NOT-COMMIT';
const git = (root, args) => execFileSync('git', args, {cwd:root, encoding:'utf8', timeout:30000, maxBuffer:32*1024*1024});
export function assertP1Checkout(root, {reviewOnly=false, evidencePath, expectedHead, allowedChanges}={}) {
  assert.equal(realpathSync(git(root,['rev-parse','--show-toplevel']).trim()),realpathSync(root),'Use the repository root');
  const head=git(root,['rev-parse','HEAD']).trim();
  if(expectedHead) assert.equal(head,expectedHead,'Git HEAD changed during qualification');
  const rows=git(root,['ls-files','-v','-z']).split('\0').filter(Boolean);
  assert.ok(rows.length && rows.every(row=>row.startsWith('H ')),'Hidden or unsupported Git index flags');
  if(reviewOnly) {
    assert.equal(git(root,['rev-parse','--abbrev-ref','HEAD']).trim(),'HEAD','Review requires a detached worktree');
    assert.ok(lstatSync(path.join(root,'.git')).isFile(),'Review requires a linked disposable worktree');
  }
  if(evidencePath) {
    assert.ok(rows.includes('H '+evidencePath),'Review evidence must be tracked');
    assert.ok(lstatSync(path.join(root,evidencePath)).isFile(),'Review evidence must be a regular file');
  }
  const changes=git(root,['status','--porcelain=v1','-z','--untracked-files=all']).split('\0').filter(Boolean);
  if(!allowedChanges) assert.equal(changes.length,0,'Start with a clean Git worktree');
  else for(const entry of changes) assert.ok(/^( M|\?\?) /.test(entry)&&allowedChanges.has(entry.slice(3)),'Unexpected worktree change: '+entry);
  return head;
}

/** A review fixture is never a release receipt. */
export function markP1ReviewFixture(record,id) {
  return {...record,status:REVIEW_FIXTURE_STATUS,development:{...record.development,state:REVIEW_FIXTURE_STATUS,note:'Disposable local review of '+id+' only. Fixture dates are not human evidence.'},nextMilestone:'Conduct real accessibility review, then discard this worktree. Never commit or deploy this fixture.'};
}
