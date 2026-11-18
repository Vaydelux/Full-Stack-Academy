import {solve} from './solution/solution';
const found=solve([{id:'a',score:5}],'a');
if(found){const count:number=found.score;void count;}
// @ts-expect-error generic constraint requires an id field
solve([{score:5}],'a');
