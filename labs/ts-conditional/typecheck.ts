import {solve} from './solution/solution';
import type {Unwrap} from './solution/solution';
const p:Promise<number>=solve(Promise.resolve(7));void p;
const value:Unwrap<Promise<string>>='text';void value;
// @ts-expect-error inferred resolved string must not be a number
const invalid:Unwrap<Promise<string>>=123;
void invalid;
