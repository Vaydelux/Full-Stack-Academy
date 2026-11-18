import React from 'react';
import {solve} from './solution';
export function Workshop(){const names=[{name:'Save'},{name:'Cancel'}];return <section aria-label="Accessible query workshop"><h2>Buttons with names</h2>{names.map(item=><button key={item.name} type="button">{item.name}</button>)}<p>{solve(names,'Save')}</p></section>;}
