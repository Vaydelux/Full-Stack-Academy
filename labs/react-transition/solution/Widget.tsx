'use client';
import React,{useState,useTransition} from 'react';
import {solve} from './solution';
const items=['React','Next','Redux'];
export function Workshop(){const [query,setQuery]=useState('');const [results,setResults]=useState(items);const [pending,startTransition]=useTransition();return <section aria-label="Transition filter"><label>Query <input value={query} onChange={e=>{setQuery(e.target.value);startTransition(()=>setResults(solve(items,e.target.value)));}} /></label><output>{pending?'Updating…':results.join(', ')}</output></section>;}
