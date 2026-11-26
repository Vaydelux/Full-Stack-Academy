/** Canonical read-access model. Never grants completion or lab certification. */
export function buildCurriculumAccess(topics, publishedIds, readingIds) {
  const canonical = new Set(topics.map(topic => topic.id));
  if (canonical.size !== topics.length) throw Error('Duplicate canonical topic');
  const published = new Set(publishedIds), reading = new Set(readingIds);
  if (published.size !== publishedIds.length || reading.size !== readingIds.length) throw Error('Duplicate access ID');
  for (const id of published) if (!canonical.has(id)) throw Error('Unknown published topic: ' + id);
  for (const id of reading) {
    if (!canonical.has(id)) throw Error('Unknown reading topic: ' + id);
    if (published.has(id)) throw Error('Overlapping access: ' + id);
  }
  return topics.map(topic => ({ ...topic, access: published.has(topic.id) ? 'published' : reading.has(topic.id) ? 'reading' : 'planned' }));
}

export function curriculumNeighbors(catalog, currentId) {
  const available = catalog.filter(topic => topic.access !== 'planned');
  const index = available.findIndex(topic => topic.id === currentId);
  return index < 0 ? { previous: null, next: null } : { previous: available[index - 1] ?? null, next: available[index + 1] ?? null };
}

export function curriculumPrerequisites(catalog, ids, currentId) {
  const byId = new Map(catalog.map(topic => [topic.id, topic]));
  return [...new Set(ids)].filter(id => id !== currentId).flatMap(id => {
    const topic = byId.get(id);
    return topic ? [topic] : [];
  });
}

export function filterCurriculumAccess(catalog, access) {
  return access === 'all' ? catalog.slice() : catalog.filter(topic => topic.access === access);
}
