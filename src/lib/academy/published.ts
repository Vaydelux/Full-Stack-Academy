import { AUTHORED_LESSONS, AUTHORED_LESSON_IDS } from './authored-content';
import browser from '@/content/lessons/00.01.01.meta.json';
import lifecycle from '@/content/lessons/00.01.02.meta.json';
import jsx from '@/content/lessons/06.01.01.meta.json';

export const MDX_METADATA = new Map([browser, lifecycle, jsx].map(meta => [meta.id, meta]));
export const LOCAL_LAB_LESSONS = [browser, lifecycle];
export const PUBLISHED_LESSON_IDS = [...new Set([...AUTHORED_LESSON_IDS, ...MDX_METADATA.keys()])].sort();
export const isPublishedLesson = (id: string) => PUBLISHED_LESSON_IDS.includes(id);
export function lessonRubric(id: string): string[] | undefined {
  return AUTHORED_LESSONS[id]?.challenge.rubric ?? LOCAL_LAB_LESSONS.find(meta => meta.id === id)?.rubric;
}
