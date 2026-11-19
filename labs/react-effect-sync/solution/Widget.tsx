'use client';
import React,{useEffect,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [room,setRoom]=useState('alpha');useEffect(()=>{const oldTitle=document.title;document.title='Room '+solve(room,'');return()=>{document.title=oldTitle;};},[room]);return <section aria-label="Room synchronization"><button type="button" onClick={()=>setRoom('beta')}>Change room</button><output>Room {room}</output></section>;}
