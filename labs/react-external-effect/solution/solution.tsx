import {useEffect,useState} from 'react';
export type SizeSource={read:()=>number;subscribe:(listener:()=>void)=>()=>void};
export function watchWidth(source:SizeSource,notify:(width:number)=>void) {
  notify(source.read());
  return source.subscribe(()=>notify(source.read()));
}
export function WidthNotice() {
  const [width,setWidth]=useState(0);
  useEffect(()=>watchWidth({read:()=>window.innerWidth,subscribe:listener=>{
    window.addEventListener('resize',listener);return ()=>window.removeEventListener('resize',listener);
  }},setWidth),[]);
  return <p>Width: {width}</p>;
}
