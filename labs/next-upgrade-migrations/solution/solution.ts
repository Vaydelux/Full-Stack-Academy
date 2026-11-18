export function solve(changes:readonly string[]){return ['package.json','lockfile','migration-review','typecheck','build','browser'].every(s=>changes.includes(s));}
