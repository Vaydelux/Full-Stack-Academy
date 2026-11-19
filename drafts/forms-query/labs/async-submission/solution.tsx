import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
class HTTPStatus extends Error { readonly status:number; constructor(status:number){super('HTTP '+status);this.status=status;} }
type Operation={key:string;payload:{title:string;priority:'normal'}};
export default function RetryForm(){
 const {register,handleSubmit,formState:{isSubmitting}}=
  useForm<{title:string}>({defaultValues:{title:'Practice task'}});
 const busy=useRef(false), attempt=useRef<Operation|null>(null);
 const [state,setState]=useState('Ready');
 async function execute(op:Operation){
  if(busy.current)return;
  busy.current=true; attempt.current=op; setState('Sending');
  try{
   const r=await fetch('/api/tasks',{method:'POST',
    headers:{'content-type':'application/json','idempotency-key':op.key},body:JSON.stringify(op.payload)});
   if(!r.ok)throw new HTTPStatus(r.status);
   attempt.current=null;setState('Saved');
  }catch(error){
   if(error instanceof HTTPStatus && error.status<500 && error.status!==429){
    attempt.current=null;setState('Request rejected; correct input before trying again');
   }else setState('Not confirmed; retry using the same key');
  }
  finally{busy.current=false;}
 }
 return <form onSubmit={handleSubmit(async ({title})=>{
   if(attempt.current)return; // Unknown outcome must be resolved before another create.
   await execute({key:crypto.randomUUID(),payload:{title,priority:'normal'}});
 })}>
  <label htmlFor="title">Title</label>
  <input id="title" {...register('title',{required:true,minLength:3,maxLength:100})}/>
  <button type="submit" disabled={isSubmitting||state==='Sending'||!!attempt.current}>Create task</button>
  <button type="button" disabled={state==='Sending'||!attempt.current}
   onClick={()=>{if(attempt.current)void execute(attempt.current)}}>Retry same request</button>
  <p role="status">{state}</p>
 </form>;
}
