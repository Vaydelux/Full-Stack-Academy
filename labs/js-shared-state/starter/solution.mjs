const shared=[];export function solve(initial=[]){shared.push(...initial);return {add(v){shared.push(v);},read(){return shared;}};}
