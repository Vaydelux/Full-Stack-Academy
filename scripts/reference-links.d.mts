type Ref = { id: string; lessonCrossReferences?: readonly string[] };
type Authored = { id: string; relatedLessonIds?: readonly string[] };
export type ReferenceGraph = { byReference: Map<string, Set<string>>; byLesson: Map<string, Set<string>>; authoredIds: Set<string> };
export function buildReferenceLinks(entries: readonly Ref[], authored: readonly Authored[], lessons: readonly {id:string}[]): ReferenceGraph;
export function relatedReferences<T extends Ref>(graph: ReferenceGraph, entries: readonly T[], lessonId: string): (T & {authored:boolean})[];
export function relatedCurriculum<T extends {id:string}>(graph: ReferenceGraph, catalog: readonly T[], referenceId: string): T[];
