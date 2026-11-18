'use client';
import React,{useState} from 'react';
import {solve} from './solution';
function useSearch(){const [text,setText]=useState('React');return {text,setText,query:solve(text)};}
export function Workshop(){const {text,setText,query}=useSearch();return <section aria-label="Custom search hook"><label>Search <input value={text} onChange={e=>setText(e.target.value)} /></label><output>Query: {query}</output></section>;}
