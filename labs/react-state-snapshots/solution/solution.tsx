import {useState} from 'react';
export function increment(previous:number){return previous+1;}
export function SnapshotCounter({initial=0}:{initial?:number}) {
 const [count,setCount]=useState(initial);
 return <button type="button" onClick={()=>setCount(increment)}>Count: {count}</button>;
}
