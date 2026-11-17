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

export function SkillCard({ title, level, skills }: SkillCardProps): ReactElement {
  return (
    <article aria-label={title}>
      <h2>{title}</h2>
      <p>{level}</p>
      {skills.length === 0 ? (
        <p role="status">No skills have been added.</p>
      ) : (
        <ul>
          {skills.map((skill) => <li key={skill.id}>{skill.label}</li>)}
        </ul>
      )}
    </article>
  );
}
