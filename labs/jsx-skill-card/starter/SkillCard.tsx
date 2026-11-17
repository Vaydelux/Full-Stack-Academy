import type { ReactElement } from 'react';

export interface Skill {
  id: string;
  label: string;
}
export interface SkillCardProps {
  title: string;
  level: string;
  skills: Skill[];
}

// TODO: Render the title, level and a semantic list of skills.
// TODO: Use stable keys, not the array index.
// TODO: Provide an accessible empty state if skills is empty.
export function SkillCard(_props: SkillCardProps): ReactElement {
  return <article><h2>Finish this skill card</h2></article>;
}
