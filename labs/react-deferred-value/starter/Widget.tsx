'use client';
import React,{useDeferredValue,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [query,setQuery]=useState('react');const deferred=useDeferredValue(query);return <section aria-label="Deferred results"><label>Search <input value={query} onChange={e=>setQuery(e.target.value)} /></label><output aria-busy={solve(query,deferred)}>{deferred}</output></section>;}
