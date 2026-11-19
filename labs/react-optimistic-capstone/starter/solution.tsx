import {startTransition,useOptimistic,useRef,useState,type FormEvent} from 'react';
export type Entry={id:string;text:string;pending:boolean};
export function reconcile(current:readonly Entry[],item:Entry):Entry[]{return [...current,item];}
export function CommentsCapstone(){
 const [saved,setSaved]=useState<Entry[]>([]);const [shown,addPending]=useOptimistic(saved,(items:Entry[],item:Entry)=>[...items,item]);
 const [draft,setDraft]=useState('');const sequence=useRef(0);
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const text=draft.trim();if(!text)return;
  const item:Entry={id:`local-${++sequence.current}`,text,pending:true};
  startTransition(async()=>{addPending(item);await Promise.resolve();
   startTransition(()=>setSaved(curr=>reconcile(curr,{...item,pending:false})));});setDraft('');
 }
 return <section><h2>Comments</h2><form onSubmit={submit}><label htmlFor="capstone-comment">Message</label><input id="capstone-comment" value={draft} onChange={e=>setDraft(e.target.value)}/>
 <button type="submit">Post</button></form><ul>{shown.map(entry=><li key={entry.id}>{entry.text}{entry.pending?' (pending)':''}</li>)}</ul></section>;
}
