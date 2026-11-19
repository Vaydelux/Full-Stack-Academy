import {useState} from 'react';
export function addTwo(start:number){return [1,1].reduce(n=>n+1,start);}
export function BatchingCounter({initial=0}:{initial?:number}) {
 const [count,setCount]=useState(initial);
 return <button type="button" onClick={()=>{setCount(n=>n+1);setCount(n=>n+1);}}>Count: {count}</button>;
}
