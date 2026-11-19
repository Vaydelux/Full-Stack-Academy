import {createStore} from 'zustand/vanilla';
type Task={id:string;title:string};
type Selection={selectedId:string|null;tasks:Task[];select:(id:string|null)=>void};
export function makeSelectionStore(){
 return createStore<Selection>()(set=>({
  selectedId:null,tasks:[{id:'t1',title:'Sensitive'}],
  select:selectedId=>set({selectedId}),
 }));
}
export const selectedTask=(_rows:readonly {id:string}[],_id:string|null)=>null;
