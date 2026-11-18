import React from 'react';
import {notFound,redirect} from 'next/navigation';
// Example conditional page action
export default function DocumentPage({status}:{status:'missing'|'moved'|'present'}){if(status==='missing')notFound();if(status==='moved')redirect('/documents');return <main><h1>Document</h1></main>;}
