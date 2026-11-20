import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
class HTTPStatus extends Error { readonly status:number; constructor(status:number){super('HTTP '+status);this.status=status;} }
type Operation={key:string;payload:{title:string;priority:'normal'}};
export default function RetryForm(){
 const {register,handleSubmit,formState:{isSubmitting}}=
  useForm<{title:string}>({defaultValues:{title:'Practice task'}});
 const busy=useRef(false);
 const [attempt,setAttempt]=useState<Operation|null>(null);
 const [state,setState]=useState('Ready');
 async function execute(op:Operation){
  if(busy.current)return;
  busy.current=true; setAttempt(op); setState('Sending');
  try{
   const r=await fetch('/api/tasks',{method:'POST',
    headers:{'content-type':'application/json','idempotency-key':op.key},body:JSON.stringify(op.payload)});
   if(!r.ok)throw new HTTPStatus(r.status);
   setAttempt(null);setState('Saved');
  }catch(error){
   if(error instanceof HTTPStatus && error.status<500 && error.status!==408 && error.status!==429){
    setAttempt(null);setState('Request rejected; correct input before trying again');
   }else setState('Not confirmed; retry using the same key');
  }
  finally{busy.current=false;}
 }
 return <form onSubmit={event=>{void handleSubmit(async ({title})=>{
   if(attempt)return; // Unknown outcome must be resolved before another create.
   await execute({key:crypto.randomUUID(),payload:{title,priority:'normal'}});
 })(event);}}>
  <label htmlFor="title">Title</label>
  <input id="title" {...register('title',{required:true,minLength:3,maxLength:100})}/>
  <button type="submit" disabled={isSubmitting||state==='Sending'||!!attempt}>Create task</button>
  <button type="button" disabled={state==='Sending'||!attempt}
   onClick={()=>{if(attempt)void execute(attempt)}}>Retry same request</button>
  <p role="status">{state}</p>
 </form>;
}
