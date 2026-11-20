import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
type Page={items:{id:string;title:string}[];nextCursor:string|null};
export function Pager(){
 const client=useQueryClient();
 const key=['tasks',{status:'todo',mode:'infinite'}] as const;
 const pages=useInfiniteQuery({
  queryKey:key,
  initialPageParam:null as string|null,
  queryFn:async({pageParam,signal})=>{
   const params=new URLSearchParams({status:'todo',limit:'10'});
   if(pageParam)params.set('cursor',pageParam);
   const response=await fetch('/api/tasks?'+params,{signal});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return response.json() as Promise<Page>;
  },
  getNextPageParam:last=>last.nextCursor,
  maxPages:10,
  retry:(count,error)=>count<1&&!/^HTTP 4\d\d$/.test(String(error.message)),
 });
 if(pages.isPending)return <p role="status">Loading pages…</p>;
 if(pages.isError)return <div role="alert">Pagination failed.
  <button type="button" onClick={()=>{void client.resetQueries({queryKey:key,exact:true});}}>Restart pages</button></div>;
 return <div><ul>{pages.data.pages.flatMap(p=>p.items).map(t=><li key={t.id}>{t.title}</li>)}</ul>
  <button type="button" disabled={!pages.hasNextPage||pages.isFetchingNextPage} onClick={()=>{void pages.fetchNextPage();}}>Load more</button></div>;
}
