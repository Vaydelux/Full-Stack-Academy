"use client";
import React,{useState} from "react";
export function Workshop(){const [open,setOpen]=useState(false);return <nav aria-label="Account navigation"><h2>Account dropdown</h2><button type="button" aria-expanded={open} aria-controls="account-links" onClick={()=>setOpen(v=>!v)}>Account options</button><div id="account-links" hidden={!open}><a href="/account">Profile</a><a href="/settings">Settings</a></div></nav>;}
