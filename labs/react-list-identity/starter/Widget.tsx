import React from 'react';
import {solve} from './solution';
const roster=[{id:'u2',name:'Lin'},{id:'u1',name:'Ada'}];
export function Workshop(){const ids=solve(roster);return <section aria-label="Roster"><h2>Team roster</h2><ul>{roster.map((p,i)=><li key={ids[i]}>{p.name}</li>)}</ul></section>;}
