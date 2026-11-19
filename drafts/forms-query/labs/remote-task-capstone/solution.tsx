import { useRef, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const TaskInput=z.object({
 title:z.string().trim().min(3).max(100),
 priority:z.enum(['low','normal','high']),
});
type TaskState='todo'|'doing'|'done';
type Task={id:string;title:string;priority:'low'|'normal'|'high';status:TaskState;revision:number};
type Page={items:Task[];nextCursor:string|null};
type Attempt={body:z.output<typeof TaskInput>;key:string};
class StatusError extends Error {
 readonly status:number;
 constructor(status:number){super('HTTP '+status);this.status=status;}
}
async function request<T>(url:string,init:RequestInit={}):Promise<T>{
 const response=await fetch(url,{...init,credentials:'same-origin',cache:'no-store',redirect:'error'});
 if(!response.ok)throw new StatusError(response.status);
 return (response.status===204?null:await response.json()) as T;
}
export default function RemoteTaskCapstone(){
 const queryClient=useQueryClient();
 const [filter,setFilter]=useState<'all'|TaskState>('all');
 const [notice,setNotice]=useState('');
 const [mutationError,setMutationError]=useState('');
 const key=['tasks',{status:filter,limit:10}] as const;
 const attempt=useRef<Attempt|null>(null);
 const submitting=useRef(false);
 const form=useForm<z.input<typeof TaskInput>,unknown,z.output<typeof TaskInput>>({
  resolver:zodResolver(TaskInput),defaultValues:{title:'',priority:'normal'},
 });
 const list=useQuery({
  queryKey:key,
  queryFn:({signal})=>request<Page>('/api/tasks?'+new URLSearchParams({
   status:filter,limit:'10',
  }),{signal}),
  staleTime:10_000,
 });
 const create=useMutation({
  mutationFn:(operation:Attempt)=>request<Task>('/api/tasks',{
   method:'POST',headers:{'content-type':'application/json','idempotency-key':operation.key},
   body:JSON.stringify(operation.body),
  }),
  retry:false,
 });
 const status=useMutation({
  mutationFn:({task,next}:{task:Task;next:TaskState})=>request<Task>(
   '/api/tasks/'+encodeURIComponent(task.id),{
    method:'PATCH',headers:{
     'content-type':'application/json','if-match':'"'+task.revision+'"',
    },
    body:JSON.stringify({status:next}),
   }),
  onMutate:async({task,next})=>{
   await queryClient.cancelQueries({queryKey:key});
   const before=queryClient.getQueryData<Page>(key);
   queryClient.setQueryData<Page>(key,current=>current?{
    ...current,items:current.items
     .map(item=>item.id===task.id?{...item,status:next}:item)
     .filter(item=>filter==='all'||item.status===filter),
   }:current);
   return {before,key};
  },
  onError:(error,_task,context)=>{
   if(context?.before)queryClient.setQueryData(context.key,context.before);
   setMutationError('Status update failed: '+String(error)+'; refresh stale revisions.');
  },
  onSettled:()=>{void queryClient.resetQueries({queryKey:['tasks']});},
 });
 const remove=useMutation({
  mutationFn:(task:Task)=>request<null>('/api/tasks/'+encodeURIComponent(task.id),{method:'DELETE'}),
  onMutate:async(task)=>{
   await queryClient.cancelQueries({queryKey:key});
   const before=queryClient.getQueryData<Page>(key);
   queryClient.setQueryData<Page>(key,current=>current?{
    ...current,items:current.items.filter(item=>item.id!==task.id),
   }:current);
   return {before,key};
  },
  onError:(error,_task,context)=>{
   if(context?.before)queryClient.setQueryData(context.key,context.before);
   setMutationError('Delete failed: '+String(error)+'; task restored.');
  },
  onSettled:()=>{void queryClient.resetQueries({queryKey:['tasks']});},
 });
 async function send(operation:Attempt){
  if(submitting.current)return;
  submitting.current=true;attempt.current=operation;setNotice('Submitting…');
  try{
   await create.mutateAsync(operation);
   attempt.current=null;form.reset();setNotice('Created; fetching fresh server data');
   void queryClient.resetQueries({queryKey:['tasks']});
  }catch(error){
   const transient=!(error instanceof StatusError)||error.status===429||error.status>=500;
   if(!transient)attempt.current=null;
   setNotice(transient?'Result unconfirmed; retry with the SAME key.':'Request rejected; correct the input before a new create.');
   form.setError('root.server',{message:String(error)});
  }finally{submitting.current=false;}
 }
 const anyPending=create.isPending||status.isPending||remove.isPending;
 return <section>
  <h2>Remote task workflow</h2>
  <form onSubmit={form.handleSubmit(async data=>{
   if(attempt.current)return;
   await send({body:data,key:crypto.randomUUID()});
  })}>
   <label htmlFor="cap-title">Task title</label>
   <input id="cap-title" {...form.register('title')} aria-invalid={!!form.formState.errors.title}
    aria-describedby={form.formState.errors.title?'cap-title-error':undefined}/>
   {form.formState.errors.title&&<p id="cap-title-error" role="alert">{form.formState.errors.title.message}</p>}
   <label htmlFor="cap-priority">Priority</label>
   <select id="cap-priority" {...form.register('priority')}>
    <option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option>
   </select>
   <button type="submit" disabled={anyPending||!!attempt.current}>Create</button>
  </form>
  {form.formState.errors.root?.server&&<p role="alert">{form.formState.errors.root.server.message}</p>}
  <button type="button" disabled={anyPending||!attempt.current}
   onClick={()=>{if(attempt.current)void send(attempt.current)}}>Retry same create</button>
  <p role="status">{notice}</p>
  <label htmlFor="task-status-filter">Filter tasks</label>
  <select id="task-status-filter" value={filter} onChange={event=>setFilter(event.target.value as 'all'|TaskState)}>
   <option value="all">All tasks</option><option value="todo">To do</option>
   <option value="doing">In progress</option><option value="done">Completed</option>
  </select>
  {list.isPending?<p role="status">Loading…</p>:list.isError?<p role="alert">Read failed.</p>:
   <ul>{list.data.items.map(task=>{
    const next:TaskState=task.status==='todo'?'doing':task.status==='doing'?'done':'todo';
    return <li key={task.id}>
     <strong>{task.title}</strong> <small>{task.status} · revision {task.revision}</small>
     <button type="button" disabled={anyPending} onClick={()=>{
      setMutationError('');status.mutate({task,next});
     }}>Move to {next}</button>
     <button type="button" disabled={anyPending} onClick={()=>{
      setMutationError('');remove.mutate(task);
     }}>Delete</button>
    </li>;
   })}</ul>}
  {mutationError&&<p role="alert">{mutationError}</p>}
 </section>;
}
