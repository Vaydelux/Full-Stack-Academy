import type { StagedManuscript } from './staged-inventory.mjs';
export type ReadingBlock =
  | { kind: 'paragraph' | 'quote'; text: string }
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'code'; language: string; text: string }
  | { kind: 'list'; title?: string; ordered: boolean; items: string[] }
  | { kind: 'step'; title: string; file: string; expected: string }
  | { kind: 'quiz'; question: string; choices: string[]; answer: number; explanation: string; misconception: string }
  | { kind: 'table'; headers: string[]; rows: string[][] };
export type InlineToken = { kind: 'text' | 'code' | 'strong'; text: string } | { kind: 'link'; text: string; href: string };
export function readingInventory(records: readonly StagedManuscript[], publishedIds: readonly string[]): StagedManuscript[];
export function parseReading(source: string): ReadingBlock[];
export function inlineTokens(text: string): InlineToken[];
export function safeReference(raw: string): string | null;
