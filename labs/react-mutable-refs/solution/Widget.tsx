'use client';
import React,{useRef,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const ref=useRef(0);const [visible,setVisible]=useState(0);return <section aria-label="Ref counter"><button type="button" onClick={()=>{ref.current=solve(ref.current).value;setVisible(ref.current);}}>Commit ref to screen</button><output>{visible}</output></section>;}
