import type { ComponentType } from 'react';
import DraftLesson01 from '../../drafts/forms-query/lessons/09.02.01.mdx';
import DraftLesson02 from '../../drafts/forms-query/lessons/09.02.02.mdx';
import DraftLesson03 from '../../drafts/forms-query/lessons/09.02.03.mdx';
import DraftLesson04 from '../../drafts/forms-query/lessons/09.02.04.mdx';
import DraftLesson05 from '../../drafts/forms-query/lessons/09.02.05.mdx';
import DraftLesson06 from '../../drafts/forms-query/lessons/09.02.06.mdx';
import DraftLesson07 from '../../drafts/forms-query/lessons/09.02.07.mdx';
import DraftLesson08 from '../../drafts/forms-query/lessons/09.02.08.mdx';
import DraftLesson09 from '../../drafts/forms-query/lessons/09.03.01.mdx';
import DraftLesson10 from '../../drafts/forms-query/lessons/09.03.02.mdx';
import DraftLesson11 from '../../drafts/forms-query/lessons/09.03.03.mdx';
import DraftLesson12 from '../../drafts/forms-query/lessons/09.03.04.mdx';
import DraftLesson13 from '../../drafts/forms-query/lessons/09.03.05.mdx';
import DraftLesson14 from '../../drafts/forms-query/lessons/09.03.06.mdx';
import DraftLesson15 from '../../drafts/forms-query/lessons/09.03.07.mdx';
import DraftLesson16 from '../../drafts/forms-query/lessons/09.03.08.mdx';

/**
 * Explicit, independently navigable MDX previews. Intentionally separate
 * from the published lesson registry and course-progress navigation.
 *
 * This registry contains explanatory MDX only; TSX practice apps still
 * execute in their locked local RHF/Query Vite workspace.
 */
export const FORMS_QUERY_DRAFT_IDS = [
  '09.02.01',
  '09.02.02',
  '09.02.03',
  '09.02.04',
  '09.02.05',
  '09.02.06',
  '09.02.07',
  '09.02.08',
  '09.03.01',
  '09.03.02',
  '09.03.03',
  '09.03.04',
  '09.03.05',
  '09.03.06',
  '09.03.07',
  '09.03.08',
] as const;

export type FormsQueryDraftId = (typeof FORMS_QUERY_DRAFT_IDS)[number];

const drafts: Record<FormsQueryDraftId, ComponentType> = {
  '09.02.01': DraftLesson01,
  '09.02.02': DraftLesson02,
  '09.02.03': DraftLesson03,
  '09.02.04': DraftLesson04,
  '09.02.05': DraftLesson05,
  '09.02.06': DraftLesson06,
  '09.02.07': DraftLesson07,
  '09.02.08': DraftLesson08,
  '09.03.01': DraftLesson09,
  '09.03.02': DraftLesson10,
  '09.03.03': DraftLesson11,
  '09.03.04': DraftLesson12,
  '09.03.05': DraftLesson13,
  '09.03.06': DraftLesson14,
  '09.03.07': DraftLesson15,
  '09.03.08': DraftLesson16,
};

export function isFormsQueryDraftId(value: string): value is FormsQueryDraftId {
  return Object.prototype.hasOwnProperty.call(drafts, value);
}

export function FormsQueryDraftArticle({ lessonId }: { lessonId: FormsQueryDraftId }) {
  const Article = drafts[lessonId];
  return <Article />;
}
