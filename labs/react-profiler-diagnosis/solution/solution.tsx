import {Profiler,type ReactNode} from 'react';
export function summarizeRenders(samples:readonly number[]){
 if(samples.some(x=>!Number.isFinite(x)||x<0))throw new RangeError('Invalid render sample');
 return {count:samples.length,totalMs:samples.reduce((sum,x)=>sum+x,0)};
}
export function ProfiledSection({children,onRender}:{children:ReactNode;onRender:(id:string,phase:'mount'|'update'|'nested-update',actualDuration:number)=>void}){
 return <Profiler id="section" onRender={(id,phase,duration)=>onRender(id,phase,duration)}>{children}</Profiler>;
}
