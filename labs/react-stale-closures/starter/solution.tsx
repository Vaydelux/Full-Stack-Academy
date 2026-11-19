import {useState} from 'react';
export type Updater=(prior:number)=>number;
export function enqueueTwice(dispatch:(update:Updater)=>void) {
 const captured=0;dispatch(()=>captured+1);dispatch(()=>captured+1);
}
export function BurstCounter() {
 const [count,setCount]=useState(0);
 return <button type="button" onClick={()=>enqueueTwice(setCount)}>Score: {count}</button>;
}
