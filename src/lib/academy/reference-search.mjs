export function normalizeReference(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function selectReferences(entries, authoredIds, {query = '', category = 'all', visibility = 'all'} = {}) {
  const authored = new Set(authoredIds);
  const phrase = normalizeReference(query.slice(0, 160));
  const terms = phrase.split(/\s+/).filter(Boolean).slice(0, 12);
  const ranked = [];
  for (const entry of entries) {
    const hasDraft = authored.has(entry.id);
    if (category !== 'all' && category !== entry.category) continue;
    if (visibility === 'authored' && !hasDraft) continue;
    if (visibility === 'indexed' && hasDraft) continue;
    const title = normalizeReference(entry.title);
    const haystack = normalizeReference(`${entry.title} ${entry.category} ${entry.id} ${entry.heading ?? ''} ${entry.version ?? ''} ${entry.summary ?? ''}`);
    if (!terms.every(term => haystack.includes(term))) continue;
    const score = !phrase ? 0 : title === phrase ? 3 : title.startsWith(phrase) ? 2 : terms.every(term => title.includes(term)) ? 1 : 0;
    ranked.push({entry, score, hasDraft});
  }
  ranked.sort((a,b) => b.score-a.score || Number(b.hasDraft)-Number(a.hasDraft) || a.entry.title.localeCompare(b.entry.title) || a.entry.id.localeCompare(b.entry.id));
  return ranked.map(item => item.entry);
}
