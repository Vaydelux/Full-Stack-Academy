// Navigate only between published topics within the current canonical module.
export function lessonNeighbors(lessons, publishedIds, currentId) {
  const current = lessons.find(lesson => lesson.id === currentId);
  const published = new Set(publishedIds);
  if (!current || !published.has(currentId)) return { previous: null, next: null };
  const peers = lessons.filter(lesson => lesson.moduleId === current.moduleId && published.has(lesson.id));
  const position = peers.findIndex(lesson => lesson.id === currentId);
  return { previous: peers[position - 1] ?? null, next: peers[position + 1] ?? null };
}
