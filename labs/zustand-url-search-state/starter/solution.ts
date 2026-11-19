import {createStore,type StoreApi} from 'zustand/vanilla';
type Status='all'|'active';
type QueryState={status:Status;setStatus:(status:Status)=>void};
export function makeQueryStore(search:string){
 const status:Status=new URLSearchParams(search).get('status')==='active'?'active':'all';
 return createStore<QueryState>()(set=>({status,setStatus:status=>set({status})}));
}
export const toQuery=(_store:StoreApi<QueryState>)=>'';
