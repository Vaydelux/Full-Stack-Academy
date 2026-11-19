import {useRef} from 'react';
export function focusNode(_node:Pick<HTMLInputElement,'focus'>|null):boolean {return false;}
export function FocusSearch() {
 const input=useRef<HTMLInputElement>(null);
 return <form onSubmit={e=>e.preventDefault()}><label htmlFor="focus-search">Search</label>
 <input id="focus-search" ref={input}/><button type="button" onClick={()=>focusNode(input.current)}>Focus input</button></form>;
}
