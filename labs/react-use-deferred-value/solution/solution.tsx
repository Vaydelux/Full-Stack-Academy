import {useDeferredValue,useState} from 'react';
export function searchNames(names:readonly string[],query:string){
 const q=query.trim().toLocaleLowerCase();return names.filter(n=>n.toLocaleLowerCase().includes(q));
}
export function DeferredSearch({names}:{names:readonly string[]}){
 const [query,setQuery]=useState('');const deferred=useDeferredValue(query);
 const matches=searchNames(names,deferred);
 return <section><label htmlFor="deferred-query">Name</label><input id="deferred-query" value={query} onChange={e=>setQuery(e.target.value)}/>
 <ul>{matches.map(n=><li key={n}>{n}</li>)}</ul></section>;
}
