export function solve(buttons:readonly {name:string}[],target:string){return buttons.find(x=>x.name===target)?.name??null;}
