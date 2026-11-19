import {useState,useTransition} from 'react';
export function activityLabel(count:number){
 if(!Number.isSafeInteger(count)||count<0)throw new RangeError('Count must be nonnegative');
 return count===1?'1 activity':`${count} activities`;
}
export function ActivityPanel(){
 const [count,setCount]=useState(0);const [pending,startTransition]=useTransition();
 return <section><button type="button" onClick={()=>startTransition(()=>setCount(n=>n+1))}>Add activity</button>
 <p role="status">{pending?'Updating':activityLabel(count)}</p></section>;
}
