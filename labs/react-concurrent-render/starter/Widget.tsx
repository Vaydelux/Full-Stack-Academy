'use client';
import React,{useState,useTransition} from 'react';
import {solve} from './solution';
export function Workshop(){const [input,setInput]=useState('');const [result,setResult]=useState('');const [pending,startTransition]=useTransition();return <section aria-label="Concurrent updates"><label>Search <input value={input} onChange={e=>{setInput(e.target.value);startTransition(()=>setResult(e.target.value));}} /></label><output>{pending?'Updating':result} — current snapshot {solve(1,2)}</output></section>;}
