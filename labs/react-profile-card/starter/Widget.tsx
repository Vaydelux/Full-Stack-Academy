'use client';
import React,{useState} from 'react';
import {solve} from './solution';
const member=solve({id:'u1',name:'Ada',role:'Engineer'});
export function Workshop(){const [following,setFollowing]=useState(false);return <article aria-label="Profile card"><h2>{member.name}</h2><p>{member.role}</p><button type="button" aria-pressed={following} onClick={()=>setFollowing(v=>!v)}>{following?'Following':'Follow'}</button></article>;}
