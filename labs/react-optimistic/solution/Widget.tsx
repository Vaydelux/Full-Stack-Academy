'use client';
import React,{useOptimistic,useState,useTransition} from 'react';
import {solve,type Entry} from './solution';
export function Workshop(){const [items,setItems]=useState<Entry[]>([{id:'a',text:'Hello'}]);const [shown,addOptimistic]=useOptimistic(items,(current:Entry[],entry:Entry)=>[...current,entry]);const [busy,startTransition]=useTransition();const add=()=>startTransition(async()=>{const pending={id:'b',text:'Pending'};addOptimistic(pending);await Promise.resolve();setItems(previous=>solve(previous,pending,true));});return <section aria-label="Optimistic comments"><button type="button" disabled={busy} onClick={add}>Add comment</button><ul>{shown.map(entry=><li key={entry.id}>{entry.text}</li>)}</ul></section>;}
