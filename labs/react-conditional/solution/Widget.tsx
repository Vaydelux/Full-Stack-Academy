import React from 'react';
import {solve,type State} from './solution';
function Status({state}:{state:State}){return <p role="status">{solve(state)}</p>;}
export function Workshop(){return <section aria-label="Request status workshop"><Status state="error" /></section>;}
