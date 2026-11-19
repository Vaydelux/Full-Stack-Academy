import {useState} from 'react';
export function AnnouncementButton(){
 const [active,setActive]=useState(false);
 return <section><button type="button" aria-pressed={active} onClick={()=>setActive(current=>!current)}>Toggle notice</button>
 <p role="status">{active?'Notice enabled':'Notice disabled'}</p></section>;
}
