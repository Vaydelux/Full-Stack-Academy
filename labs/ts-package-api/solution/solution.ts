const publicEntries=new Map([['.', './dist/index.js'],['./types','./dist/types.js']]);export function solve(path:string):string|null{return publicEntries.get(path)??null;}
