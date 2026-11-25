import assert from 'node:assert/strict';

const unique = (values, label) => {
  assert.ok(Array.isArray(values) && values.every(v => typeof v === 'string' && v.length > 0), 'Invalid '+label);
  assert.equal(new Set(values).size, values.length, 'Duplicate '+label);
  return [...values].sort();
};
export function projectScope(curriculum) {
  const tracks = unique(curriculum.tracks.map(t => t.id), 'track ID');
  const moduleIds = unique(curriculum.modules.map(m => m.id), 'module ID');
  const topicIds = unique(curriculum.lessons.map(l => l.id), 'topic ID');
  const modules = curriculum.modules.map(m => {
    assert.ok(tracks.includes(m.track), 'Unknown module track: '+m.id);
    return [m.id, m.track];
  }).sort((a,b) => a[0].localeCompare(b[0]));
  const topics = curriculum.lessons.map(l => {
    assert.ok(moduleIds.includes(l.moduleId), 'Unknown topic module: '+l.id);
    assert.equal(modules.find(m => m[0] === l.moduleId)[1], l.trackId, 'Topic track mismatch: '+l.id);
    return [l.id, l.moduleId, l.trackId];
  }).sort((a,b) => a[0].localeCompare(b[0]));
  assert.equal(topics.length, topicIds.length);
  return {schemaVersion:1, tracks, modules, topics};
}
export function verifyFrozenScope(curriculum, frozen, published, staged) {
  const scope = projectScope(curriculum);
  assert.deepEqual(scope, frozen, 'Curriculum scope changed: explicit owner-approved scope revision required');
  const ids = new Set(scope.topics.map(t => t[0]));
  const pub = unique([...published], 'published ID');
  const draft = unique([...staged], 'staged ID');
  for (const id of [...pub, ...draft]) assert.ok(ids.has(id), 'Unknown source ID: '+id);
  const covered = new Set([...pub, ...draft]);
  const missing = [...ids].filter(id => !covered.has(id));
  assert.deepEqual(missing, [], 'Canonical source coverage lost');
  return {topics:ids.size,published:pub.length,stagedUnpublished:draft.filter(id => !pub.includes(id)).length};
}
