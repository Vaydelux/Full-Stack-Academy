'use client';
import React from 'react';
// Example file: app/dashboard/error.tsx
export default function DashboardError({reset}:{error:Error;reset:()=>void}){return <main role="alert"><h1>Could not load dashboard</h1><button type="button" onClick={reset}>Try again</button></main>;}
