export interface StagedManuscript { id: string; group: string; source: string }
export function collectStagedManuscripts(root: string, catalog: { lessons: readonly { id: string; moduleId: string }[] }): StagedManuscript[];
export function collectStagedIds(root: string, catalog: { lessons: readonly { id: string; moduleId: string }[] }): string[];
