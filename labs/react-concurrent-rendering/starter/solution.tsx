import {useState,useTransition} from 'react';
export function activityLabel(_count:number){return '0 activities';}
export function ActivityPanel(){
 const [count,setCount]=useState(0);const [pending,startTransition]=useTransition();
 return <section><button type="button" onClick={()=>startTransition(()=>setCount(n=>n+1))}>Add activity</button>
 <p role="status">{pending?'Updating':activityLabel(count)}</p></section>;
}
