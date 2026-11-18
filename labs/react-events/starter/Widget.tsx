'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [count,setCount]=useState(0);return <section aria-label="Counter"><h2>Event handlers</h2><button type="button" onClick={()=>setCount(n=>solve(n,'up'))}>Increase</button><button type="button" onClick={()=>setCount(n=>solve(n,'down'))}>Decrease</button><output aria-live="polite">{count}</output></section>;}
