export async function solve(task){try{return {ok:true,value:task()};}catch{return {ok:false,error:'failed'};}}
