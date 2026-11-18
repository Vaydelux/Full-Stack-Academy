'use client';
import React,{useEffect,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [ticks,setTicks]=useState(0);useEffect(()=>{const id=setInterval(()=>setTicks(v=>v+1),1000);return()=>clearInterval(id);},[]);return <section aria-label="Clean interval"><h2>Timer cleanup</h2><output>Active leaked timers after cleanup: {solve(1)}; ticks {ticks}</output></section>;}
