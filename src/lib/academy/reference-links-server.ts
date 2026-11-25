import 'server-only';
import { AUTHORED_REFERENCES } from './authored-content';
import { lessons, references } from './curriculum';
import { readCurriculumAccess } from './course-progress-server';
import { buildReferenceLinks, relatedReferences, relatedCurriculum } from '../../../scripts/reference-links.mjs';

const graph = buildReferenceLinks(references, AUTHORED_REFERENCES, lessons);
export function readLessonReferences(lessonId: string) { return relatedReferences(graph, references, lessonId); }
export function readReferenceLessons(referenceId: string) { return relatedCurriculum(graph, readCurriculumAccess(), referenceId); }
