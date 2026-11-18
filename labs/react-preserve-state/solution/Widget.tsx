'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [selectedId,setSelectedId]=useState('a');const [flip,setFlip]=useState(false);const ids=flip?['a','b']:['b','a'];return <section aria-label="Stable selection"><button type="button" onClick={()=>setFlip(v=>!v)}>Reorder</button><ul>{ids.map(id=><li key={id}><button type="button" onClick={()=>setSelectedId(id)}>{id}</button></li>)}</ul><output>Selected: {solve(ids,selectedId)}</output></section>;}
