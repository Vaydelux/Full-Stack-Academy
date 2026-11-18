export function solve(count:number,event:'up'|'down'):number{if(!Number.isInteger(count)||count<0)throw new TypeError('Valid counter required');return event==='up'?count+1:Math.max(0,count-1);}
