export type Command={kind:'add';amount:number}|{kind:'remove';amount:number};export function solve(stock:number,command:Command):number{return stock+command.amount;}
