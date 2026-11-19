import { useForm } from 'react-hook-form';
import { useState } from 'react';
export default function SettingsForm(){
 const {register,handleSubmit,reset,formState:{isDirty,isSubmitting}}=useForm<{title:string}>({defaultValues:{title:''}});
 const [message,setMessage]=useState('');
 return <form onSubmit={handleSubmit(async data=>{
  try{
   const response=await fetch('/api/tasks',{method:'POST',
    headers:{'content-type':'application/json','idempotency-key':crypto.randomUUID()},
    body:JSON.stringify({title:data.title,priority:'normal'})});
   if(!response.ok)throw new Error('HTTP '+response.status);
   reset({title:''});setMessage('Saved');
  }catch{setMessage('Save failed; your draft is preserved');}
 })}>
  <label htmlFor="title">Title</label><input id="title" {...register('title',{required:true,minLength:3})}/>
  <button disabled={isSubmitting||!isDirty}>Save</button>
  <output aria-live="polite">{message}</output>
 </form>;
}
