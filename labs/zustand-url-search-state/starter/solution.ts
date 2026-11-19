import {createStore} from 'zustand/vanilla';
export function makeQueryStore(search:string){
 const status=new URLSearchParams(search).get('status')==='active'?'active':'all';
 return createStore()(set=>({status,setStatus:(status:string)=>set({status})}));
}
export const toQuery=(_store:unknown)=>'';
