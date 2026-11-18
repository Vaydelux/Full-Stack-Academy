import {solve} from './solution/solution';
const object={id:'a',count:5};
const value:number=solve(object,'count');void value;
// @ts-expect-error missing property does not satisfy keyof
solve(object,'missing');
