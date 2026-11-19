import {createStore,type StoreApi} from 'zustand/vanilla';
export type Status='all'|'active';
export type QueryState={status:Status;setStatus:(status:Status)=>void};
export function makeQueryStore(search:string){
 const status:Status=new URLSearchParams(search.startsWith('?')?search.slice(1):search).get('status')==='active'?'active':'all';
 return createStore<QueryState>()(set=>({status,setStatus:status=>set({status})}));
}
export function toQuery(store:StoreApi<QueryState>){
 const status=store.getState().status;
 return status==='all'?'':new URLSearchParams({status}).toString();
}
