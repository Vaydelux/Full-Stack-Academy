import { useQuery } from '@tanstack/react-query';
export default function TaskList({status}:{status:'todo'|'doing'|'done'}) {
 const tasks=useQuery({queryKey:['tasks'],queryFn:async()=>{
  const response=await fetch('/api/tasks?status='+status);
  if(!response.ok)throw new Error('Request failed');
  return response.json() as Promise<{items:{id:string;title:string}[]}>;
 }});
 return <ul>{tasks.data?.items.map(item=><li key={item.id}>{item.title}</li>)}</ul>;
}
