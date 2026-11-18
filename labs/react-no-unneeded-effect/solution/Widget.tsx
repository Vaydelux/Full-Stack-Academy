'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [prices,setPrices]=useState([10,5]);return <section aria-label="Derived summary"><button type="button" onClick={()=>setPrices(xs=>[...xs,2])}>Add item</button><output>Subtotal: {solve(prices)}</output></section>;}
