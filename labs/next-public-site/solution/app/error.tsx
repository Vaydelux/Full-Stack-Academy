'use client';
export default function ErrorBoundary({reset}:{error:Error;reset:()=>void}){
 return <main role="alert"><h1>Page unavailable</h1><button type="button" onClick={reset}>Retry</button></main>;
}
