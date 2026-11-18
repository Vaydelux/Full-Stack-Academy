'use client';
import React,{useState} from 'react';
// Safe client entry receives public values, not a private DB/service module.
export default function AccountBadge({displayName}:{displayName:string}){const [open,setOpen]=useState(false);return <section aria-label="Public account"><button type="button" onClick={()=>setOpen(v=>!v)}>{displayName}</button>{open&&<p>Public account options</p>}</section>;}
