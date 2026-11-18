import React from 'react';
import {solve} from './solution';
export function Workshop(){return <section aria-label="render workshop"><h2>Render versus commit</h2><output>{'Estimated text changes: '+solve('same','same')}</output></section>;}
