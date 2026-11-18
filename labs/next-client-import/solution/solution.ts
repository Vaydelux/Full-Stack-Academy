export function solve(imports:readonly string[]):string[]{return imports.filter(name=>!name.startsWith('server/')&&!name.includes('/private/'));}
