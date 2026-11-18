'use client';
import React,{useEffect,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [query,setQuery]=useState('first');const [visible,setVisible]=useState('');useEffect(()=>setVisible(query),[query]);return <section aria-label="Dependencies"><button type="button" onClick={()=>setQuery('second')}>Change query</button><output>{visible||'Waiting'} — change expected: {String(solve('first','second'))}</output></section>;}
