import {useState} from 'react';
export function inverted(value:boolean){return value;}
export function useDisclosure(initial=false){
 const [open,setOpen]=useState(initial);
 return {open,toggle:()=>setOpen(value=>inverted(value)),close:()=>setOpen(false)};
}
export function Disclosure() {
 const disclosure=useDisclosure(false);
 return <button type="button" aria-expanded={disclosure.open} onClick={disclosure.toggle}>Details</button>;
}
