export function solve(version,commits){return '# '+version+'\n'+commits.filter(c=>c.startsWith('feat:')).join('\n');}
