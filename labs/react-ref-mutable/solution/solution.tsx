import {useRef,useState} from 'react';
export function nextSequence(ref:{current:number}):number {
 ref.current+=1;return ref.current;
}
export function SequenceButton() {
 const sequence=useRef(0);const [shown,setShown]=useState(0);
 return <button type="button" onClick={()=>setShown(nextSequence(sequence))}>Sequence: {shown}</button>;
}
