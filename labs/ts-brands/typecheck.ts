import {solve} from './solution/solution';
import type {UserId} from './solution/solution';
const validated=solve('usr_abc');
if(validated){const id:UserId=validated;void id;}
// @ts-expect-error raw strings cannot be assigned a branded UserId
const unsafe:UserId='usr_abc';
void unsafe;
