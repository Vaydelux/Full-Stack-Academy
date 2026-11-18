'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [number,setNumber]=useState(0);return <section aria-label="Batched updates"><button type="button" onClick={()=>{setNumber(n=>solve(n,[1]));setNumber(n=>solve(n,[1]));}}>Add two updates</button><output>{number}</output></section>;}
