import { useMutation } from '@tanstack/react-query';
export function CreateTask(){
 const create=useMutation({mutationFn:()=>fetch('/api/tasks',{method:'POST',body:'{}'})});
 return <button onClick={()=>create.mutate()}>Create</button>;
}
