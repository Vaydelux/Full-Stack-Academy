import type { Metadata } from 'next';
import Link from 'next/link';
import { DocShell } from '@/components/course/DocShell';
import { readCurriculumAccess } from '@/lib/academy/course-progress-server';
import { AUTHORED_REFERENCES } from '@/lib/academy/authored-content';
import { references } from '@/lib/academy/curriculum';
import { normalizeDiscoveryQuery, searchAcademy } from '../../../scripts/academy-discovery.mjs';

export const metadata: Metadata={title:'Search academy | Full-Stack Engineering Academy',robots:{index:false,follow:true}};
type Params={q?:string|string[];scope?:string|string[];page?:string|string[]};
export default async function SearchPage({searchParams}:{searchParams:Promise<Params>}){
 const params=await searchParams;
 const query=typeof params.q==='string'?params.q.slice(0,160).trim():'';
 const scope=params.scope==='lessons'||params.scope==='references'?params.scope:'all';
 const page=typeof params.page==='string'&&/^\d{1,6}$/.test(params.page)?Number(params.page):1;
 const byId=new Map(AUTHORED_REFERENCES.map(x=>[x.id,x]));
 const lessonRows=normalizeDiscoveryQuery(query)&&scope!=='references'?readCurriculumAccess().map(x=>({id:x.id,title:x.title,context:x.track+' · '+x.module,summary:x.level,status:x.access==='published'?'Published':x.access==='reading'?'Reading · lab pending':'Planned'})):[];
 const referenceRows=scope==='lessons'?[]:references.map(x=>({id:x.id,title:x.title,context:x.category,summary:byId.get(x.id)?.summary,status:byId.has(x.id)?'Authored draft':'Index only'}));
 const result=searchAcademy(lessonRows,referenceRows,query,scope,page);
 const href=(n:number)=>'/search?'+new URLSearchParams({q:query,scope,page:String(n)}).toString();
 return <DocShell>
  <h1 className="text-3xl font-extrabold tracking-tight">Search academy</h1>
  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Find curriculum topics and API references in one place. Reading editions and reference drafts do not grant course credit.</p>
  <form action="/search" method="get" role="search" className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
   <label className="min-w-0 text-sm font-semibold">Search topics and references<input name="q" type="search" defaultValue={query} maxLength={160} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-white/20 dark:bg-slate-950" /></label>
   <label className="text-sm font-semibold">Search in<select name="scope" defaultValue={scope} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-white/20 dark:bg-slate-950"><option value="all">Everything</option><option value="lessons">Curriculum</option><option value="references">References</option></select></label>
   <button type="submit" className="min-h-11 rounded-lg bg-cyan-700 px-5 font-semibold text-white hover:bg-cyan-800">Search</button>
  </form>
  {!query?<p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Try an API name, lesson ID or technology.</p>:<>
   <p role="status" className="mt-6 text-sm text-slate-600 dark:text-slate-300">{result.total} matching results</p>
   <ul className="mt-3 space-y-2">{result.items.map(item=><li key={item.kind+':'+item.id}><Link href={(item.kind==='lesson'?'/learn/':'/reference/')+item.id} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-cyan-500 dark:border-white/10 dark:bg-white/[.03]"><span className="block text-xs text-slate-600 dark:text-slate-400">{item.kind==='lesson'?'Lesson':'Reference'} · {item.context} · {item.status}</span><span className="mt-1 block font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{item.kind==='lesson'?item.id:item.summary}</span></Link></li>)}</ul>
   {result.total===0&&<p className="mt-3 text-sm">No results. Try a shorter term or change the search scope.</p>}
   {result.pages>1&&<nav aria-label="Search pagination" className="mt-5 flex flex-wrap items-center gap-4 text-sm">{result.page>1&&<Link href={href(result.page-1)} rel="prev" className="underline">Previous</Link>}<span>Page {result.page} of {result.pages}</span>{result.page<result.pages&&<Link href={href(result.page+1)} rel="next" className="underline">Next</Link>}</nav>}
  </>}
 </DocShell>;
}
