import {useEffect,useState} from 'react';
export type Clock={start:(tick:()=>void,ms:number)=>number;stop:(id:number)=>void};
export function startHeartbeat(clock:Clock,onTick:()=>void) {
 clock.start(onTick,1000);return ()=>{};
}
export function Heartbeat() {
 const [ticks,setTicks]=useState(0);
 useEffect(()=>startHeartbeat({start:(tick,ms)=>window.setInterval(tick,ms),stop:id=>window.clearInterval(id)},()=>setTicks(n=>n+1)),[]);
 return <p>Ticks: {ticks}</p>;
}
