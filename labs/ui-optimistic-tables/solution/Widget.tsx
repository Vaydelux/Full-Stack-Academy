"use client";
import React,{useState} from "react";
export function Workshop(){const [rows,setRows]=useState([{id:"a",title:"Draft"},{id:"b",title:"Published"}]);return <section aria-label="Optimistic table workshop"><h2>Records</h2><ul>{rows.map(row=><li key={row.id}>{row.title}<button type="button" onClick={()=>setRows(list=>list.filter(x=>x.id!==row.id))}>Remove demo row</button></li>)}</ul><p role="note">Local demo only; no server persistence.</p></section>;}
