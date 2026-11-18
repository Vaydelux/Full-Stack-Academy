'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [qty,setQty]=useState(2);const total=solve([{price:10,qty}]);return <section aria-label="Derived total"><h2>Cart total</h2><button type="button" onClick={()=>setQty(n=>n+1)}>Add unit</button><output>Total: {total}</output></section>;}
