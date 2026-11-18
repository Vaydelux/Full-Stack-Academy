import React from 'react';
import {solve} from './solution';
export function Workshop(){return <section aria-label="Pure roster"><h2>Pure rendering</h2><ul>{solve(['Zoe','Ada']).map(name=><li key={name}>{name}</li>)}</ul></section>;}
