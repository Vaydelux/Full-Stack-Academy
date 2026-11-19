import {useEffect,useState} from 'react';
export type RoomBus={subscribe:(room:string,listener:()=>void)=>()=>void};
export function connectRoom(roomId:string,bus:RoomBus,onMessage:()=>void) {
 if(!roomId.trim()) return ()=>{};
 return bus.subscribe(roomId,onMessage);
}
export function RoomFeed({roomId,bus}:{roomId:string;bus:RoomBus}) {
 const [messages,setMessages]=useState(0);
 useEffect(()=>connectRoom(roomId,bus,()=>setMessages(n=>n+1)),[roomId,bus]);
 return <p>Room {roomId}: {messages}</p>;
}
