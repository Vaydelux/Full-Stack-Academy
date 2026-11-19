import { useQuery } from '@tanstack/react-query';
export function Pager(){
 const tasks=useQuery({queryKey:['tasks'],queryFn:async()=>{
  const r=await fetch('/api/tasks?offset=10');return r.json();
 }});
 return <output>{JSON.stringify(tasks.data)}</output>;
}
