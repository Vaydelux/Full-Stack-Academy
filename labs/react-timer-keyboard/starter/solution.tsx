import {useEffect,useState} from 'react';
export function formatClock(seconds:number){return '00:00';}
export function shouldToggle(_event:{key:string;ctrlKey:boolean;altKey:boolean;metaKey:boolean;targetTag?:string;editable?:boolean;repeat?:boolean;defaultPrevented?:boolean}){return true;}
export function TimerKeyboard(){
 const [seconds,setSeconds]=useState(0);const [running,setRunning]=useState(false);
 useEffect(()=>{if(!running)return;const id=window.setInterval(()=>setSeconds(s=>s+1),1000);return ()=>window.clearInterval(id);},[running]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(shouldToggle({key:e.key,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey,targetTag:(e.target as HTMLElement|null)?.tagName,editable:(e.target as HTMLElement|null)?.isContentEditable,repeat:e.repeat,defaultPrevented:e.defaultPrevented})){e.preventDefault();setRunning(v=>!v);}};
 window.addEventListener('keydown',onKey);return ()=>window.removeEventListener('keydown',onKey);},[]);
 return <section><p role="timer">{formatClock(seconds)}</p><button type="button" onClick={()=>setRunning(v=>!v)}>{running?'Pause':'Start'}</button></section>;
}
