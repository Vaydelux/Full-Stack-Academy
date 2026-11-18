'use client';
import React,{useEffect,useState} from 'react';
import {solve} from './solution';
export function Workshop(){const [room,setRoom]=useState('alpha');useEffect(()=>{const controller=new AbortController();document.title='Room '+solve(room,'');return()=>controller.abort();},[room]);return <section aria-label="Room synchronization"><button type="button" onClick={()=>setRoom('beta')}>Change room</button><output>Room {room}</output></section>;}
