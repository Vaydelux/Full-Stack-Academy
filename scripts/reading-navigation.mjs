/** Reading-only navigation and anchor model. No completion or certification state. */
export function readingOutline(blocks, title) {
  const used = new Set();
  const normalized = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  const result = [];
  let first = true;
  for (const block of blocks) {
    if (first && block.kind === 'heading' && normalized(block.text) === normalized(title)) {
      first = false;
      continue;
    }
    first = false;
    if (block.kind !== 'heading' && block.kind !== 'step') { result.push(block); continue; }
    const label = block.kind === 'heading' ? block.text : block.title;
    const stem = 'reading-' + (normalized(label).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 80) || 'section');
    let anchor = stem, suffix = 2;
    while (used.has(anchor)) anchor = stem + '-' + suffix++;
    used.add(anchor);
    result.push({ ...block, anchor });
  }
  return { blocks: result, outline: result.flatMap(block => block.anchor ? [{ id: block.anchor, label: block.kind === 'heading' ? block.text : block.title, level: block.kind === 'heading' ? block.level : 3 }] : []) };
}
export function readingModuleNavigation(topics, publishedIds, readingIds, currentId) {
  const published = new Set(publishedIds), reading = new Set(readingIds);
  const current = topics.find(topic => topic.id === currentId);
  if (!current || !reading.has(currentId) || published.has(currentId)) return [];
  return topics.filter(topic => topic.moduleId === current.moduleId && (published.has(topic.id) || reading.has(topic.id))).map(topic => ({ id: topic.id, title: topic.title, edition: published.has(topic.id) ? 'published' : 'reading', active: topic.id === currentId }));
}
