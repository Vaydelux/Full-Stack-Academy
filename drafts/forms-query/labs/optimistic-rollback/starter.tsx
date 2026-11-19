import { useMutation, useQueryClient } from '@tanstack/react-query';
export function DeleteButton({id}:{id:string}){
 const client=useQueryClient();
 const del=useMutation({mutationFn:()=>fetch('/api/tasks/'+id,{method:'DELETE'}),
  onMutate:()=>{client.setQueryData<{items:{id:string}[]}>(['tasks'],old=>old?{items:old.items.filter(x=>x.id!==id)}:old);}
 });
 return <button onClick={()=>del.mutate()}>Delete</button>;
}
