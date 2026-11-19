import type { ReactNode } from 'react';
export function Panel({title}: {title:string; children:ReactNode}) {
  return <section><h2>{title}</h2></section>;
}
