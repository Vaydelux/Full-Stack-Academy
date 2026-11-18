'use client';
import React,{useActionState} from 'react';
import {solve} from './solution';
export function Workshop(){const [state,action,pending]=useActionState(async(_previous:{error:string;saved:string},form:FormData)=>solve(_previous,String(form.get('name')??'')),{error:'',saved:''});return <form action={action} aria-label="Action state form"><label>Display name <input name="name" /></label><button type="submit" disabled={pending}>Save</button><output role="status">{state.error||state.saved||'Ready'}</output></form>;}
