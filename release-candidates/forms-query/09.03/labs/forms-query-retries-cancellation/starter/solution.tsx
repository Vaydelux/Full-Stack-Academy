import { useQuery } from '@tanstack/react-query';
export function TaskList(){
 const tasks=useQuery({queryKey:['tasks'],queryFn:()=>fetch('/api/tasks').then(x=>x.json()),retry:true});
 return <output>{tasks.data?.items?.length??0}</output>;
}
