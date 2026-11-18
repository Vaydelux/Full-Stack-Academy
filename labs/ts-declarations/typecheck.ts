import {solve} from './solution/solution';
const sum:number=solve({x:1,y:2});void sum;
// @ts-expect-error PublicPoint requires y
solve({x:1});
