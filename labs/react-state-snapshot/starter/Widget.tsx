'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [count,setCount]=useState(0);return <section aria-label="Snapshot workshop"><h2>State snapshots</h2><button type="button" onClick={()=>{setCount(n=>solve(n,1));setCount(n=>solve(n,1));}}>Add two</button><output>{count}</output></section>;}
