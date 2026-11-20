import { useQuery } from '@tanstack/react-query';
type Filter='todo'|'doing'|'done';
type TaskPage={items:{id:string;title:string}[]};
export default function TaskList({status}:{status:Filter}) {
 const tasks=useQuery({queryKey:['tasks',{status,limit:10}] as const,queryFn:async({signal})=>{
  const params=new URLSearchParams({status,limit:'10'});
  const response=await fetch('/api/tasks?'+params,{signal});
  if(!response.ok)throw new Error('Task GET failed: '+response.status);
  return response.json() as Promise<TaskPage>;
 }});
 if(tasks.isPending)return <p role="status">Loading…</p>;
 if(tasks.isError)return <p role="alert">Unable to load tasks.</p>;
 return <ul>{tasks.data.items.map(item=><li key={item.id}>{item.title}</li>)}</ul>;
}
