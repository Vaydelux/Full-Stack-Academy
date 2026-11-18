'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [count,setCount]=useState(0);return <section aria-label="Delayed counter"><button type="button" onClick={()=>setTimeout(()=>setCount(latest=>solve(count,latest,1)),30)}>Queue increment</button><output>Count: {count}</output></section>;}
