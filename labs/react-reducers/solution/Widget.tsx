'use client';
import React,{useReducer} from 'react';
import {solve} from './solution';
export function Workshop(){const [s,dispatch]=useReducer(solve,{status:'editing' as const,value:''});return <form onSubmit={e=>{e.preventDefault();dispatch({type:'submit'});}}><label>Title <input value={s.value} onChange={e=>dispatch({type:'change',value:e.target.value})} /></label><button type="submit">Submit</button><output role="status">{s.status}</output></form>;}
