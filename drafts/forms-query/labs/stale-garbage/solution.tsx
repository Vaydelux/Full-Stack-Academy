import { useQuery } from '@tanstack/react-query';
export function Tasks(){
 const query=useQuery({
  queryKey:['tasks',{limit:10}],
  queryFn:async({signal})=>{
   const response=await fetch('/api/tasks?limit=10',{signal});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return response.json() as Promise<{items:{id:string}[]}>;
  },
  staleTime:10_000,
  gcTime:5*60_000,
  refetchOnWindowFocus:true,
 });
 if(query.isPending)return <p>Loading…</p>;
 if(query.isError)return <p role="alert">Server tasks unavailable.</p>;
 return <output>{query.data.items.length} task(s)</output>;
}
