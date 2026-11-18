import React from 'react';
// Server Component example: check existence only, do not serialize the secret.
export default function EnvStatus(){const ready=Boolean(process.env.INTERNAL_API_KEY);return <main><h1>Configuration health</h1><p role="status">{ready?'Private server integration configured':'Integration not configured'}</p></main>;}
