export type State='loading'|'error'|'ready';export function solve(state:State){switch(state){case 'loading':return 'Loading…';case 'error':return 'Could not load';case 'ready':return 'Ready';}}
