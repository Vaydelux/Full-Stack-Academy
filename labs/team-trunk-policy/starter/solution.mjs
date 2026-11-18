export function solve(branches){return branches.filter(b=>b.name.startsWith('feature/')).map(b=>b.name);}
