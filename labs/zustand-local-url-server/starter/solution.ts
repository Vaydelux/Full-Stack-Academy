import {createStore} from 'zustand/vanilla';
type UIState={open:boolean;setOpen:(value:boolean)=>void};
export function makeUiStore(){
 return createStore<UIState>()(set=>({
  open:false,
  setOpen:value=>set({open:value&&false}),
 }));
}
