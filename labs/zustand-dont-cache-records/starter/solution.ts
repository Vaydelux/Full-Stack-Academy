import {createStore} from 'zustand/vanilla';
export function makeSelectionStore(){return createStore()(set=>({
 selectedId:null as string|null,tasks:[{id:'t1',title:'Sensitive'}],
 select:(selectedId:string|null)=>set({selectedId}),
}));}
export const selectedTask=(_rows:readonly {id:string}[],_id:string|null)=>null;
