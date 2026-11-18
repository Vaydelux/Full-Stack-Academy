'use client';
import React,{memo,useState} from 'react';
import {solve} from './solution';
const Badge=memo(function Badge({id}:{id:string}){return <strong>Item {id}</strong>;});
export function Workshop(){const [count,setCount]=useState(0);return <section aria-label="Memo demo"><button type="button" onClick={()=>setCount(n=>n+1)}>Other state</button><Badge id="a" /><output>State {count}; stable ID {String(solve({id:'a'},{id:'a'}))}</output></section>;}
