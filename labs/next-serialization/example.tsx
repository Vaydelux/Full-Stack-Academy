import React from 'react';
// Server wrapper passes only a public serializable DTO to a Client Component.
function PublicBadge({name}:{name:string}){return <strong>{name}</strong>;}
export default function ProfilePage(){const dto={name:'Ada'};return <main><h1>Public profile</h1><PublicBadge name={dto.name}/></main>;}
