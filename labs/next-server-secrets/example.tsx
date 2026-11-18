import React from 'react';
// Example Server Component; the variable must be configured only on the server.
export default function SecretsPage(){const hasSecret=Boolean(process.env.INTERNAL_API_KEY);return <main><h1>Secret configuration</h1><p role="status">{hasSecret?'Configured on server':'Not configured'}</p></main>;}
