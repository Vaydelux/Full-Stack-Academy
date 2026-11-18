// CI-free local qualification checklist helper: does not invoke cloud builds.
export type Gates={lint:boolean;typecheck:boolean;build:boolean;browser:boolean};
export function ready(g:Gates){return Object.values(g).every(Boolean);}
