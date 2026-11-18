import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('JSX preview is isolated and checks message provenance', () => {
  const parent = read('src/components/workspace/PreviewPane.tsx');
  const child = read('public/preview.html');
  const config = read('next.config.ts');
  assert.match(parent, /sandbox="allow-scripts"/);
  assert.doesNotMatch(parent, /sandbox="[^"]*allow-same-origin/);
  assert.match(parent, /e\.source !== iframeRef\.current\?\.contentWindow/);
  assert.match(parent, /e\.origin !== 'null'/);
  assert.match(child, /e\.source !== parent/);
  assert.match(child, /d\.code\.length > 65536/);
  assert.match(config, /Access-Control-Allow-Origin/);
});

test('backups normalize untrusted progress instead of merging', () => {
  const src = read('src/lib/academy/store.ts');
  assert.match(src, /export function normalizeProgress/);
  assert.match(src, /const restored = normalizeProgress\(result\.data\.data\)/);
  assert.match(src, /progress: restored/);
  assert.doesNotMatch(src, /const filteredComplete/);
});

test('each track belongs to exactly one group', () => {
  const src = read('src/lib/academy/curriculum.ts');
  const section = src.split('export const TRACK_GROUPS: TrackGroup[] = [')[1].split('];')[0];
  const matches = [...section.matchAll(/trackIds:\s*\[([^\]]+)\]/g)];
  const ids = matches.flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 28);
});

test('planned lessons cannot impersonate authored code labs', () => {
  assert.match(read('src/components/workspace/CodeEditor.tsx'), /No lab code for this topic yet/);
  assert.match(read('src/components/workspace/PreviewPane.tsx'), /Lab not published yet/);
});
