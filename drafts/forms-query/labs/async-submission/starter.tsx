import { useState } from 'react';
export default function RetryForm(){
 const [message,setMessage]=useState('');
 async function submit(){
  const key=crypto.randomUUID(); // wrong for retrying an unknown outcome
  await fetch('/api/tasks',{method:'POST',headers:{'content-type':'application/json','idempotency-key':key},
    body:JSON.stringify({title:'Practice task',priority:'normal'})});
  setMessage('Request sent');
 }
 return <div><button onClick={submit}>Create</button><button onClick={submit}>Retry</button><p>{message}</p></div>;
}
