import { useMutation, useQueryClient } from '@tanstack/react-query';
export function CreateTask(){
 const client=useQueryClient();
 const create=useMutation({
  mutationFn:async({title,key}:{title:string;key:string})=>{
   const response=await fetch('/api/tasks',{method:'POST',headers:{
    'content-type':'application/json','idempotency-key':key
   },body:JSON.stringify({title,priority:'normal'})});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return response.json();
  },
  retry:false,
  onSuccess:async()=>{await client.invalidateQueries({queryKey:['tasks']});},
 });
 return <button type="button" disabled={create.isPending}
  onClick={()=>create.mutate({title:'Practice cache invalidation',key:crypto.randomUUID()})}>
  {create.isPending?'Saving…':'Create task'}
 </button>;
}
