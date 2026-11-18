import React from 'react';
import {solve,type User} from './solution';
function Badge({user}:{user:User}){return <strong>{solve(user)}</strong>;}
export function Workshop(){return <section aria-label="profile workshop"><h2>Team profile</h2><Badge user={{name:'Ada',role:'Engineer'}} /></section>;}
