export function solve(file,rules){return rules.find(r=>file.startsWith(r.pattern.replace('/**','')))?.owner??null;}
