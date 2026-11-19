"use client";
import React,{useState} from "react";
import {solve} from "./solution";
export function Workshop(){const [list,setList]=useState(["Planning","Building","Review"]);return <section aria-label="Sortable task workshop"><h2>Reorder tasks</h2><ol>{list.map((title,i)=><li key={title}>{title}<button type="button" disabled={i===0} aria-label={"Move "+title+" up"} onClick={()=>setList(p=>solve(p,i,i-1))}>Up</button></li>)}</ol></section>;}
