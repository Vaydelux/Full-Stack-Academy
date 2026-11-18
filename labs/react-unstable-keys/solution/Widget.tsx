'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [reversed,setReversed]=useState(false);const original=[{id:'a',label:'First'},{id:'b',label:'Second'}];const items=reversed?[...original].reverse():original;const keys=solve(items);return <section aria-label="Stable key bug hunt"><button type="button" onClick={()=>setReversed(v=>!v)}>Reverse order</button><ul>{items.map((item,i)=><li key={keys[i]}><label>{item.label}<input defaultValue={item.label} /></label></li>)}</ul></section>;}
