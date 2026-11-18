import {solve} from './solution/solution';
import type {Key} from './solution/solution';
let candidate:string='course:css';
if(solve(candidate)){const trusted:Key=candidate;void trusted;}
// @ts-expect-error invalid key namespace
const invalid:Key='admin:all';
void invalid;
