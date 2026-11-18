import {solve} from './solution/solution';
const first=solve([1,'a'] as const);
const literal:1=first;void literal;
// @ts-expect-error preserved literal type 1 must not be assignable to 2
const wrong:2=first;
void wrong;
