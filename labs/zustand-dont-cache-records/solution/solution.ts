import {createStore} from 'zustand/vanilla';
export type Selection={selectedId:string|null;select:(id:string|null)=>void};
export function makeSelectionStore(){return createStore<Selection>()(set=>({
 selectedId:null,select:selectedId=>set({selectedId}),
}));}
export function selectedTask<T extends {id:string}>(rows:readonly T[],id:string|null):T|null{
 return id?rows.find(row=>row.id===id)??null:null;
}
