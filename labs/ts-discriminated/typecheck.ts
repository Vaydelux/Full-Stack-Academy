import {solve} from './solution/solution';
solve(5,{kind:'remove',amount:2});
// @ts-expect-error invalid discriminant must be rejected
solve(5,{kind:'replace',amount:2});
