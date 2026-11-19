import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import TaskList from './task-list';
// Next App Router Server Component. Teaching-only local anonymous public data.
export default async function Page(){
 const client=new QueryClient();
 await client.prefetchQuery({
  queryKey:['tasks',{status:'todo',limit:10}],
  queryFn:async()=>{
   const r=await fetch('http://127.0.0.1:3337/api/tasks?status=todo&limit=10',{cache:'no-store'});
   if(!r.ok)throw new Error('Local teaching API unavailable');
   return r.json();
  },
 });
 return <HydrationBoundary state={dehydrate(client)}><TaskList/></HydrationBoundary>;
}
