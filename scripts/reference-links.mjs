/** Bidirectional explicit reference edges; no inferred publication or completion. */
export function buildReferenceLinks(entries, authored, lessons) {
  const lessonIds = new Set(lessons.map(x => x.id));
  const references = new Map(entries.map(x => [x.id, x]));
  const authoredIds = new Set(authored.map(x => x.id));
  if (references.size !== entries.length || authoredIds.size !== authored.length || lessonIds.size !== lessons.length) throw Error('Duplicate reference graph ID');
  const byReference = new Map(entries.map(x => [x.id, new Set()]));
  const byLesson = new Map(lessons.map(x => [x.id, new Set()]));
  function connect(refId, ids) {
    if (!references.has(refId)) throw Error('Unknown reference: ' + refId);
    for (const id of ids) {
      if (!lessonIds.has(id)) throw Error('Unknown linked lesson: ' + id);
      byReference.get(refId).add(id);
      byLesson.get(id).add(refId);
    }
  }
  for (const entry of entries) connect(entry.id, entry.lessonCrossReferences ?? []);
  for (const entry of authored) connect(entry.id, entry.relatedLessonIds ?? []);
  return { byReference, byLesson, authoredIds };
}

export function relatedReferences(graph, entries, lessonId) {
  const ids = graph.byLesson.get(lessonId);
  return entries.filter(entry => ids?.has(entry.id)).map(entry => ({ ...entry, authored: graph.authoredIds.has(entry.id) }));
}

export function relatedCurriculum(graph, catalog, referenceId) {
  const ids = graph.byReference.get(referenceId);
  return catalog.filter(lesson => ids?.has(lesson.id));
}
