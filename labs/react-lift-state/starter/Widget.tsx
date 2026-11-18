'use client';
import React,{useState} from 'react';
import {solve} from './solution';
function Preview({value}:{value:string}){return <output>{value}</output>;}
export function Workshop(){const [value,setValue]=useState('shared');const views=solve(value);return <section aria-label="Shared state"><label>Message <input value={value} onChange={e=>setValue(e.target.value)} /></label><Preview value={views.left}/><Preview value={views.right}/></section>;}
