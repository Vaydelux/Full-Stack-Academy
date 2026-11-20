import { useMutation, useQueryClient } from '@tanstack/react-query';
type TaskPage={items:{id:string;title:string}[]};
export function DeleteButton({id}:{id:string}){
 const client=useQueryClient();
 const key=['tasks',{status:'all',limit:10}] as const;
 const del=useMutation({
  mutationFn:async()=>{
   const response=await fetch('/api/tasks/'+encodeURIComponent(id),{method:'DELETE'});
   if(!response.ok)throw new Error('HTTP '+response.status);
  },
  onMutate:async()=>{
   await client.cancelQueries({queryKey:key});
   const before=client.getQueryData<TaskPage>(key);
   client.setQueryData<TaskPage>(key,current=>current?{...current,items:current.items.filter(t=>t.id!==id)}:current);
   return {before};
  },
  onError:(_error,_variables,ctx)=>{if(ctx?.before)client.setQueryData(key,ctx.before);},
  onSettled:()=>client.invalidateQueries({queryKey:['tasks']}),
 });
 return <button type="button" disabled={del.isPending} onClick={()=>del.mutate()}>
  {del.isPending?'Removing…':'Delete'}
 </button>;
}
