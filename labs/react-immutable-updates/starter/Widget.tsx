'use client';
import React,{useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [rows,setRows]=useState([{id:'a',qty:1}]);return <section aria-label="Immutable list"><button type="button" onClick={()=>setRows(p=>solve(p,'a',p[0].qty+1))}>Increase quantity</button><output>{rows[0].qty}</output></section>;}
