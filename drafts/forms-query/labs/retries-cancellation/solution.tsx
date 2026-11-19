import { useQuery } from '@tanstack/react-query';
class RequestError extends Error{
 constructor(readonly status:number){super('Task GET failed: '+status);}
}
export function TaskList(){
 const tasks=useQuery({
  queryKey:['tasks',{status:'todo'}],
  queryFn:async({signal})=>{
   const r=await fetch('/api/tasks?status=todo',{signal});
   if(!r.ok)throw new RequestError(r.status);
   return r.json() as Promise<{items:{id:string}[]}>;
  },
  retry:(count,error)=>count<2 && (!(error instanceof RequestError)||error.status>=500),
  retryDelay:attempt=>Math.min(1000*2**attempt,4000),
 });
 if(tasks.isError)return <p role="alert">Task service unavailable; retry later.</p>;
 return <output>{tasks.data?.items.length??0} tasks</output>;
}
