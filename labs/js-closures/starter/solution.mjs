let shared=0;export function solve(start=0){shared=start;return {increment(){return ++shared;},value(){return shared;}};}
