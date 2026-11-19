"use client";
import React,{useState} from "react";
import {solve} from "./solution";
const items=solve([{id:"save",label:"Save",kind:"button"},{id:"reset",label:"Reset",kind:"button"}]);
export function Workshop(){const [status,setStatus]=useState("Ready");return <main aria-label="Component gallery workshop"><h2>Component gallery</h2><div className="flex flex-wrap gap-3">{items.map(item=><button type="button" key={item.id} onClick={()=>setStatus(item.label+" selected")} className="rounded px-4 py-2 focus-visible:ring-2" >{item.label}</button>)}</div><p role="status">{status}</p></main>;}
