import { useRef, useState } from 'react';
type Operation={key:string;payload:{title:string;priority:'normal'}};
export default function RetryForm(){
 const pending=useRef(false);
 const attempt=useRef<Operation|null>(null);
 const [state,setState]=useState('Ready');
 async function submit(){
  if(pending.current)return;
  pending.current=true;
  const operation=attempt.current??{key:crypto.randomUUID(),payload:{title:'Practice task',priority:'normal'}};
  attempt.current=operation;
  setState('Sending');
  try{
   const res=await fetch('/api/tasks',{method:'POST',headers:{'content-type':'application/json','idempotency-key':operation.key},body:JSON.stringify(operation.payload)});
   if(!res.ok)throw new Error('HTTP '+res.status);
   attempt.current=null; setState('Saved');
  }catch{setState('Not confirmed; retry with same key');}
  finally{pending.current=false;}
 }
 return <div><button type="button" disabled={state==='Sending'} onClick={submit}>
  {attempt.current?'Retry request':'Create task'}</button><p role="status">{state}</p></div>;
}
