type Project={name:string;deps:string[]};export function solve(projects:Project[]):string[]{return projects.map(p=>p.name);}
