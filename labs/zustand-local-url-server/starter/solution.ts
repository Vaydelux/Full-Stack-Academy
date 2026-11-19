import {createStore} from 'zustand/vanilla';
export function makeUiStore(){
 return createStore(()=>({open:false,setOpen:(_value:boolean)=>{}}));
}
