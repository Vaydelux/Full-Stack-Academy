import { AUTHORED_LESSONS, AUTHORED_LESSON_IDS } from './authored-content';
import browser from '@/content/lessons/00.01.01.meta.json';
import lifecycle from '@/content/lessons/00.01.02.meta.json';
import jsx from '@/content/lessons/06.01.01.meta.json';

import foundation3 from '@/content/lessons/00.01.03.meta.json';
import foundation4 from '@/content/lessons/00.01.04.meta.json';
import foundation5 from '@/content/lessons/00.01.05.meta.json';
import foundation6 from '@/content/lessons/00.01.06.meta.json';
import foundation7 from '@/content/lessons/00.01.07.meta.json';
import foundation8 from '@/content/lessons/00.01.08.meta.json';

import toolchain1 from '@/content/lessons/00.02.01.meta.json';
import toolchain2 from '@/content/lessons/00.02.02.meta.json';
import toolchain3 from '@/content/lessons/00.02.03.meta.json';
import toolchain4 from '@/content/lessons/00.02.04.meta.json';
import toolchain5 from '@/content/lessons/00.02.05.meta.json';
import toolchain6 from '@/content/lessons/00.02.06.meta.json';
import toolchain7 from '@/content/lessons/00.02.07.meta.json';
import toolchain8 from '@/content/lessons/00.02.08.meta.json';

import debugging1 from '@/content/lessons/00.03.01.meta.json';
import debugging2 from '@/content/lessons/00.03.02.meta.json';
import debugging3 from '@/content/lessons/00.03.03.meta.json';
import debugging4 from '@/content/lessons/00.03.04.meta.json';
import debugging5 from '@/content/lessons/00.03.05.meta.json';
import debugging6 from '@/content/lessons/00.03.06.meta.json';
import debugging7 from '@/content/lessons/00.03.07.meta.json';
import debugging8 from '@/content/lessons/00.03.08.meta.json';

export const MDX_METADATA = new Map([browser, lifecycle, foundation3, foundation4, foundation5, foundation6, foundation7, foundation8, toolchain1, toolchain2, toolchain3, toolchain4, toolchain5, toolchain6, toolchain7, toolchain8, debugging1, debugging2, debugging3, debugging4, debugging5, debugging6, debugging7, debugging8, jsx].map(meta => [meta.id, meta]));
export const LOCAL_LAB_LESSONS = [browser, lifecycle, foundation3, foundation4, foundation5, foundation6, foundation7, foundation8, toolchain1, toolchain2, toolchain3, toolchain4, toolchain5, toolchain6, toolchain7, toolchain8, debugging1, debugging2, debugging3, debugging4, debugging5, debugging6, debugging7, debugging8];
export const PUBLISHED_LESSON_IDS = [...new Set([...AUTHORED_LESSON_IDS, ...MDX_METADATA.keys()])].sort();
export const isPublishedLesson = (id: string) => PUBLISHED_LESSON_IDS.includes(id);
export function lessonRubric(id: string): string[] | undefined {
  return AUTHORED_LESSONS[id]?.challenge.rubric ?? LOCAL_LAB_LESSONS.find(meta => meta.id === id)?.rubric;
}
