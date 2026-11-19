import {useState} from 'react';
export function AnnouncementButton(){
 const [active,setActive]=useState(false);
 return <section><button type="button" onClick={()=>setActive(current=>!current)}>Toggle notice</button>
 <p>{active?'Notice enabled':'Notice disabled'}</p></section>;
}
