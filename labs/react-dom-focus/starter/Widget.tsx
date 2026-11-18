'use client';
import React,{useRef} from 'react';
import {solve} from './solution';
export function Workshop(){const input=useRef<HTMLInputElement>(null);const focus=()=>{if(solve(Boolean(input.current)))input.current?.focus();};return <section aria-label="Focus control"><label htmlFor="workshop-name">Name</label><input id="workshop-name" ref={input}/><button type="button" onClick={focus}>Focus name</button></section>;}
