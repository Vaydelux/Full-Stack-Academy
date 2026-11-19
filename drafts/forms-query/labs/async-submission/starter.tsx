import { useForm } from 'react-hook-form';
export default function RetryForm(){
 const { register, handleSubmit }=useForm<{title:string}>({defaultValues:{title:'Practice task'}});
 const send=handleSubmit(async ({title})=>{
  // Broken: Retry executes this handler again and generates a new key each time.
  const key=crypto.randomUUID();
  await fetch('/api/tasks',{method:'POST',headers:{'content-type':'application/json','idempotency-key':key},
    body:JSON.stringify({title,priority:'normal'})});
 });
 return <form onSubmit={send}>
  <label htmlFor="title">Title</label><input id="title" {...register('title',{required:true})}/>
  <button type="submit">Create</button>
  <button type="button" onClick={()=>void send()}>Retry (unsafe)</button>
 </form>;
}
