'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * Staged lesson previews share the same rendering components as authored
 * lessons, but must never grant published course credit.
 */
const DraftLessonContext = createContext(false);

export function DraftLessonScope({ children }: { children: ReactNode }) {
  return <DraftLessonContext.Provider value={true}>{children}</DraftLessonContext.Provider>;
}

export function useDraftLessonScope() {
  return useContext(DraftLessonContext);
}
