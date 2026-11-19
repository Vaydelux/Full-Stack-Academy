'use client';

import {useState} from 'react';
import {useStore} from 'zustand';
import {createAcademyFilterStore,selectVisible,type CatalogItem} from '@/lib/academy/zustand-filters';

type DisplayItem=CatalogItem&{description:string};
const examples:readonly DisplayItem[]=[
 {id:'react',label:'React Fundamentals',type:'course',description:'Props, state and component mental models'},
 {id:'next',label:'Next.js App Router',type:'course',description:'Server and Client Component boundaries'},
 {id:'zod',label:'Zod 4 Validation',type:'course',description:'Safe parsing, strict objects and typed output'},
 {id:'ref-css',label:'CSS var() Reference',type:'reference',description:'Runtime design tokens and cascade values'},
 {id:'ref-zod',label:'Zod safeParse Reference',type:'reference',description:'Structured runtime validation errors'},
 {id:'ref-react',label:'React useState Reference',type:'reference',description:'React state updates and batching'},
];

export function StateBoundariesLab(){
 // Every mounted example gets its own vanilla Zustand store; no server request shares user state.
 const [store]=useState(createAcademyFilterStore);
 const query=useStore(store,state=>state.query);
 const kind=useStore(store,state=>state.kind);
 const density=useStore(store,state=>state.density);
 const setQuery=useStore(store,state=>state.setQuery);
 const setKind=useStore(store,state=>state.setKind);
 const setDensity=useStore(store,state=>state.setDensity);
 const reset=useStore(store,state=>state.reset);
 const [showSource,setShowSource]=useState(false);
 const visible=selectVisible(examples,{query,kind});
 const params=new URLSearchParams();
 if(query.trim())params.set('q',query.trim());
 if(kind!=='all')params.set('kind',kind);
 const shareableModel=params.toString()?'?'+params.toString():'(no filters)';
 const choiceClass='rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600';
 const activeClass=' border-cyan-700 bg-cyan-700 text-white';
 const idleClass=' border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:bg-slate-900 dark:text-slate-200';

 return <div className="space-y-6" data-state-lab="zustand">
  <section aria-label="Catalogue filter controls" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
   <div>
    <label htmlFor="zustand-search" className="mb-2 block text-sm font-semibold">Search catalogue</label>
    <input id="zustand-search" type="search" value={query} onChange={event=>setQuery(event.target.value)}
     placeholder="Try React, Zod, or CSS" autoComplete="off" className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-white/20"/>
   </div>
   <div className="grid gap-5 sm:grid-cols-2">
    <fieldset>
     <legend className="mb-2 text-sm font-semibold">Resource type</legend>
     <div className="flex flex-wrap gap-2">
      {([{id:'all',label:'All'},{id:'course',label:'Courses'},{id:'reference',label:'References'}] as const).map(option=>
       <button key={option.id} type="button" aria-pressed={kind===option.id} onClick={()=>setKind(option.id)}
        className={choiceClass+(kind===option.id?activeClass:idleClass)}>{option.label}</button>
      )}
     </div>
    </fieldset>
    <fieldset>
     <legend className="mb-2 text-sm font-semibold">Card density</legend>
     <div className="flex flex-wrap gap-2">
      {(['comfortable','compact'] as const).map(value=>
       <button key={value} type="button" aria-pressed={density===value} onClick={()=>setDensity(value)}
        className={choiceClass+(density===value?activeClass:idleClass)}>{value==='comfortable'?'Comfortable':'Compact'}</button>
      )}
     </div>
    </fieldset>
   </div>
   <button type="button" onClick={reset} className={choiceClass+idleClass}>Reset filters</button>
  </section>
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
   <section aria-labelledby="zustand-results-heading" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
    <h2 id="zustand-results-heading" className="text-xl font-bold">Visible resources</h2>
    <p role="status" aria-live="polite" className="mt-2 text-sm text-slate-600 dark:text-slate-300">{visible.length} of {examples.length} resources shown</p>
    {visible.length? <ul className={'mt-4 grid gap-3 '+(density==='compact'?'':'sm:grid-cols-2')}>
     {visible.map(item=><li key={item.id} className={'min-w-0 rounded-xl border border-slate-200 dark:border-white/15 '+(density==='compact'?'p-3':'p-4')}>
      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">{item.type}</span>
      <h3 className={'font-bold '+(density==='compact'?'mt-1 text-sm':'mt-2 text-base')}>{item.label}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
     </li>)}
    </ul>:<p className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">No matching resources. Change your query or reset the filters.</p>}
   </section>
   <div className="space-y-5">
    <section aria-labelledby="zustand-state-heading" className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
     <h2 id="zustand-state-heading" className="text-lg font-bold">State ownership</h2>
     <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">The Zustand store contains the search text, resource type and card density—never a second copy of the catalogue.</p>
     <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{JSON.stringify({query,kind,density},null,2)}</code></pre>
     <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">URL representation (illustrative only)</p>
     <code className="mt-2 block break-all rounded-lg border border-slate-200 p-3 text-xs dark:border-white/15">{shareableModel}</code>
     <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">This preview does not change browser history. A production page should treat URL filters as shareable state and separately authorize server data.</p>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]" aria-labelledby="zustand-source-heading">
     <h2 id="zustand-source-heading" className="text-lg font-bold">Inspect the store</h2>
     <button type="button" onClick={()=>setShowSource(v=>!v)} aria-expanded={showSource} aria-controls="zustand-source" className={'mt-3 '+choiceClass+idleClass}>{showSource?'Hide code':'Show store code'}</button>
     {showSource&&<pre id="zustand-source" className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{`const [store] = useState(createAcademyFilterStore);
const query = useStore(store, state => state.query);
const kind = useStore(store, state => state.kind);
const setQuery = useStore(store, state => state.setQuery);
const visible = selectVisible(catalogue, { query, kind });`}</code></pre>}
     <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Actual Zustand 5 APIs are used. The app never sends the filter values to a backend or persists them to storage in this exercise.</p>
    </section>
   </div>
  </div>
 </div>;
}
