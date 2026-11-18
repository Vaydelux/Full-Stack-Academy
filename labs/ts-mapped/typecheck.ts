import {solve} from './solution/solution';
const result=solve({id:'a',count:2},{count:3});
const count:number=result.count;void count;
// @ts-expect-error a number property must not accept a string
solve({id:'a',count:2},{count:'oops'});
