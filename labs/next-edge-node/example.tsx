import React from 'react';
// Example route segment file app/reports/page.tsx: requires Node-backed data access.
export const runtime='nodejs';
export default function Reports(){return <main><h1>Server reports</h1><p>Node-backed features require a compatible runtime.</p></main>;}
