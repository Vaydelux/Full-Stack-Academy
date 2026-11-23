/** Pure publication-inventory check. No filesystem, network, or deployment side effects. */
export function reconcilePublishedInventory({ interactiveIds, mdxIds, checkpoint, catalogIds }) {
  if (!Array.isArray(interactiveIds) || !Array.isArray(mdxIds) ||
      !checkpoint || typeof checkpoint !== 'object') {
    throw new Error('Invalid published inventory inputs');
  }
  for (const [name, ids] of [['interactive', interactiveIds], ['MDX', mdxIds]]) {
    if (ids.some(id => typeof id !== 'string' || !/^\d{2}\.\d{2}\.\d{2}$/.test(id))) {
      throw new Error('Invalid ' + name + ' published lesson ID');
    }
    if (new Set(ids).size !== ids.length) {
      throw new Error('Duplicate ' + name + ' published lesson ID');
    }
  }
  const publishedIds = [...new Set([...interactiveIds, ...mdxIds])].sort();
  if (catalogIds !== undefined) {
    if (!Array.isArray(catalogIds) || new Set(catalogIds).size !== catalogIds.length) {
      throw new Error('Invalid canonical catalog IDs');
    }
    const canonical = new Set(catalogIds);
    for (const id of publishedIds) {
      if (!canonical.has(id)) throw new Error('Unknown published lesson: ' + id);
    }
  }
  if (!Number.isSafeInteger(checkpoint.publishedLessons) ||
      checkpoint.publishedLessons !== publishedIds.length) {
    throw new Error('Published registry/checkpoint count mismatch');
  }
  if (!Number.isSafeInteger(checkpoint.authoredMdxLessons) ||
      checkpoint.authoredMdxLessons !== mdxIds.length) {
    throw new Error('MDX registry/checkpoint count mismatch');
  }
  return { publishedIds, publishedCount: publishedIds.length, mdxCount: mdxIds.length };
}
