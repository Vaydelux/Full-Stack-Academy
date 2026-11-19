import {useRef,useState} from 'react';
export function nextSequence(_ref:{current:number}):number {return 1;}
export function SequenceButton() {
 const sequence=useRef(0);const [shown,setShown]=useState(0);
 return <button type="button" onClick={()=>setShown(nextSequence(sequence))}>Sequence: {shown}</button>;
}
