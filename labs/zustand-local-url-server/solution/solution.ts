import {createStore} from 'zustand/vanilla';
export type UIState={open:boolean;setOpen:(value:boolean)=>void};
export function makeUiStore(){
 return createStore<UIState>()(set=>({open:false,setOpen:value=>set({open:value})}));
}
