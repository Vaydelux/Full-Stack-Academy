import { useQuery } from '@tanstack/react-query';
export function Tasks(){
 const query=useQuery({queryKey:['tasks'],queryFn:()=>fetch('/api/tasks').then(r=>r.json()),
  staleTime:Infinity,gcTime:0});
 return <output>{query.data?.items?.length??0}</output>;
}
