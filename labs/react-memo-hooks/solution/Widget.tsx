'use client';
import React,{useMemo,useCallback,useState} from 'react';
import {solve} from './solution';
const names=['React','Next','Redux'];
export function Workshop(){const [query,setQuery]=useState('rea');const [other,setOther]=useState(0);const visible=useMemo(()=>solve(names,query),[query]);const update=useCallback(()=>setOther(n=>n+1),[]);return <section aria-label="Memo hooks"><label>Filter <input value={query} onChange={e=>setQuery(e.target.value)} /></label><button type="button" onClick={update}>Unrelated update</button><output>{visible.join(', ')} {other}</output></section>;}
