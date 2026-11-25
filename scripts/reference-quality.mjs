/** Source quality gate; does not execute examples or certify external URLs. */
export function validateReferenceDrafts(records, index, lessons) {
  const indexById = new Map(index.map(item => [item.id, item]));
  const lessonIds = new Set(lessons.map(item => item.id));
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.id)) throw Error('Duplicate draft: ' + record.id);
    seen.add(record.id);
    const item = indexById.get(record.id);
    if (!item || !record.matchCategories?.includes(item.category) || !record.matchTitles?.includes(item.title)) throw Error('Canonical mismatch: ' + record.id);
    for (const field of ['heading','majorVersion','summary','syntax','lang','parameters','returns','minimalExample','productionExample']) {
      if (typeof record[field] !== 'string' || !record[field].trim()) throw Error('Missing ' + field + ': ' + record.id);
    }
    if (record.minimalExample.trim() === record.productionExample.trim()) throw Error('Identical examples: ' + record.id);
    for (const field of ['commonMistakes','securityPerformanceNotes']) {
      if (!Array.isArray(record[field]) || !record[field].length || record[field].some(value => typeof value !== 'string' || !value.trim())) throw Error('Missing ' + field + ': ' + record.id);
    }
    if (!record.relatedLessonIds?.length || record.relatedLessonIds.some(id => !lessonIds.has(id))) throw Error('Unknown lesson: ' + record.id);
    if (record.status !== 'Authored reference draft') throw Error('Invalid draft status: ' + record.id);
    if (typeof record.canonicalUrl !== 'string' || !/^https:\/\/[^/?#\s]+(?:[/?#]|$)/i.test(record.canonicalUrl) || /[\\\s]/.test(record.canonicalUrl) || record.canonicalUrl.split('/')[2].includes('@')) throw Error('Unsafe official URL: ' + record.id);
  }
  return seen.size;
}

export function referenceCoverage(index, authoredIds) {
  const authored = new Set(authoredIds);
  const categories = new Map();
  for (const entry of index) {
    const row = categories.get(entry.category) ?? { category: entry.category, indexed: 0, authored: 0, remaining: 0 };
    row.indexed++;
    if (authored.has(entry.id)) row.authored++; else row.remaining++;
    categories.set(entry.category, row);
  }
  return [...categories.values()];
}
