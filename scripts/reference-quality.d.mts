import type { AuthoredReference, ReferenceSubject } from '../src/lib/academy/types';
export function validateReferenceDrafts(records: readonly AuthoredReference[], index: readonly ReferenceSubject[], lessons: readonly { id: string }[]): number;
export function referenceCoverage(index: readonly { id: string; category: string }[], authoredIds: readonly string[]): { category: string; indexed: number; authored: number; remaining: number }[];
