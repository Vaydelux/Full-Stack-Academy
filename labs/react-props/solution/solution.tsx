export interface BadgeProps { name: string; role: string }
export function Badge({ name, role }: BadgeProps) {
  return <article aria-label="Team member"><h2>{name}</h2><p>{role}</p></article>;
}
