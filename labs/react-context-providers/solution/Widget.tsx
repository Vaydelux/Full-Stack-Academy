'use client';
import React,{createContext,useContext,useState} from 'react';
import {solve} from './solution';
const Theme=createContext<'light'|'dark'>('light');
function ReadTheme(){return <output>Theme: {solve(useContext(Theme))}</output>;}
export function Workshop(){const [theme,setTheme]=useState<'light'|'dark'>('dark');return <Theme.Provider value={theme}><section aria-label="Theme provider"><button type="button" onClick={()=>setTheme(t=>t==='light'?'dark':'light')}>Toggle theme</button><ReadTheme /></section></Theme.Provider>;}
