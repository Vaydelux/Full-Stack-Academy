import {startTransition,useOptimistic,useRef,useState,type FormEvent} from 'react';
export type Comment={id:string;text:string;pending:boolean};
export function optimisticAppend(state:readonly Comment[],item:Comment):Comment[]{return [...state,item];}
export function OptimisticComments({seed}:{seed:Comment[]}){
 const [saved,setSaved]=useState(seed);
 const [display,addPending]=useOptimistic(saved,optimisticAppend);
 const [draft,setDraft]=useState('');const sequence=useRef(0);
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const text=draft.trim();if(!text)return;
  const item={id:`local-${++sequence.current}`,text,pending:true};
  startTransition(async()=>{addPending(item);await Promise.resolve();
    startTransition(()=>setSaved(curr=>[...curr,{...item,pending:false}]));});
  setDraft('');
 }
 return <form onSubmit={submit}><label htmlFor="optimistic-text">Comment</label><input id="optimistic-text" value={draft} onChange={e=>setDraft(e.target.value)}/>
 <button type="submit">Send</button><ul>{display.map(c=><li key={c.id}>{c.text}{c.pending?' (pending)':''}</li>)}</ul></form>;
}
