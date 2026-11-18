import React from 'react';
import {solve} from './solution';
export function Workshop(){const result=solve('Ready');return <section aria-label="Testing Library example"><h2>Semantic assertions</h2><p role="status">{result.text}</p></section>;}
