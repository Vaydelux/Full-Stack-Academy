'use client';
import React,{Profiler,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [count,setCount]=useState(0);return <Profiler id="workshop" onRender={(_id,_phase,_duration)=>{}}><section aria-label="Profiler demo"><button type="button" onClick={()=>setCount(c=>c+1)}>Update</button><output>{count}</output><small>Example mean duration: {solve([4,8])}</small></section></Profiler>;}
