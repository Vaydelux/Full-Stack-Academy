'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [items,setItems]=useState(0);const [status,setStatus]=useState('ready');return <section aria-label="Journey test demo"><button type="button" onClick={()=>setItems(n=>n+1)}>Add item</button><button type="button" onClick={()=>setStatus(solve(items,'checkout'))}>Checkout</button><output role="status">{status}</output></section>;}
