import {useState,useTransition} from 'react';
export function matchOptions(options:readonly string[],_query:string){return [...options];}
export function TransitionSearch({options}:{options:readonly string[]}){
 const [query,setQuery]=useState('');const [resultQuery,setResultQuery]=useState('');
 const [pending,startTransition]=useTransition();
 return <section><label htmlFor="transition-query">Search</label>
 <input id="transition-query" value={query} onChange={e=>{const next=e.target.value;setQuery(next);startTransition(()=>setResultQuery(next));}}/>
 {pending&&<p role="status">Updating results</p>}
 <ul>{matchOptions(options,resultQuery).map(option=><li key={option}>{option}</li>)}</ul></section>;
}
