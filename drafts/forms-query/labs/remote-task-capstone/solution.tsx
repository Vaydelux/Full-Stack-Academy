import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const Schema=z.object({title:z.string().trim().min(3).max(100),priority:z.enum(['low','normal','high'])});
export default function NewTask(){
 const qc=useQueryClient();
 const form=useForm<z.input<typeof Schema>,unknown,z.output<typeof Schema>>({
  resolver:zodResolver(Schema),defaultValues:{title:'',priority:'normal'}
 });
 const list=useQuery({queryKey:['tasks',{status:'todo',limit:10}],queryFn:async({signal})=>{
  const response=await fetch('/api/tasks?status=todo&limit=10',{signal});
  if(!response.ok)throw new Error('HTTP '+response.status);
  return response.json() as Promise<{items:{id:string;title:string}[]}>;
 }});
 const create=useMutation({mutationFn:async(data:z.output<typeof Schema>)=>{
  const r=await fetch('/api/tasks',{method:'POST',headers:{
   'content-type':'application/json','idempotency-key':crypto.randomUUID()
  },body:JSON.stringify(data)});
  if(!r.ok)throw new Error('HTTP '+r.status);return r.json();
 },onSuccess:async()=>{await qc.invalidateQueries({queryKey:['tasks']});form.reset();}});
 return <section><form onSubmit={form.handleSubmit(v=>create.mutate(v))}>
  <label htmlFor="title">Task title</label><input id="title" {...form.register('title')}
   aria-invalid={!!form.formState.errors.title}/>
  {form.formState.errors.title&&<p role="alert">{form.formState.errors.title.message}</p>}
  <label htmlFor="priority">Priority</label><select id="priority" {...form.register('priority')}>
   <option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option></select>
  <button disabled={create.isPending}>Create</button>
  {create.isError&&<p role="alert">Could not confirm creation: {create.error.message}</p>}
 </form>{list.isPending?<p>Loading…</p>:list.isError?<p role="alert">List unavailable</p>:
  <ul>{list.data.items.map(t=><li key={t.id}>{t.title}</li>)}</ul>}</section>;
}
