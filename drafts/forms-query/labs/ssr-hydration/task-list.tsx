'use client';
import { useQuery } from '@tanstack/react-query';
type Page={items:{id:string;title:string}[];nextCursor:string|null};
export default function TaskList(){
 const result=useQuery({
  queryKey:['tasks',{status:'todo',limit:10}],
  queryFn:async({signal})=>{
   // A real Next.js deployment needs a trusted same-origin route handler/BFF.
   const response=await fetch('/api/tasks?status=todo&limit=10',{signal});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return response.json() as Promise<Page>;
  },
  staleTime:30_000,
 });
 if(result.isPending)return <p role="status">Loading tasks…</p>;
 if(result.isError)return <p role="alert">Unable to load the task list.</p>;
 return <ul>{result.data.items.map(task=><li key={task.id}>{task.title}</li>)}</ul>;
}
