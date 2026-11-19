"use client";
import React,{useState} from "react";
export function Workshop(){const [open,setOpen]=useState(false);return <section aria-label="Navigation workshop"><h2>Responsive navigation</h2><button type="button" aria-controls="mobile-links" aria-expanded={open} onClick={()=>setOpen(x=>!x)}>Menu</button><nav aria-label="Primary" id="mobile-links" hidden={!open}><a href="/learn">Lessons</a><a href="/reference">References</a></nav></section>;}
