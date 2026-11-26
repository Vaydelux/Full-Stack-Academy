/** Search only trusted catalog fields. No progress or draft execution. */
export function normalizeDiscoveryQuery(value) {
  return typeof value === 'string' ? value.slice(0,160).trim().normalize('NFKC').toLowerCase() : '';
}
export function searchAcademy(lessons, references, query, scope='all', page=1) {
  const normalized=normalizeDiscoveryQuery(query).replace(/\(\)/g,'').trim();
  if (!normalized) return {total:0,items:[],page:1,pages:0};
  const tokens=normalized.split(/\s+/).filter(Boolean).slice(0,8);
  const all=[...(scope==='references'?[]:lessons.map(x=>({...x,kind:'lesson'}))),...(scope==='lessons'?[]:references.map(x=>({...x,kind:'reference'})))];
  const seen=new Set(), hits=[];
  for(const row of all){
    const key=row.kind+':'+row.id;
    if(seen.has(key))continue;
    seen.add(key);
    const title=normalizeDiscoveryQuery(row.title).replace(/\(\)/g,''),id=normalizeDiscoveryQuery(row.id);
    const haystack=[id,title,row.context,row.summary].map(v=>typeof v==='string'?v.normalize('NFKC').toLowerCase():'').join(' ');
    if(!tokens.every(t=>haystack.includes(t)))continue;
    const score=(id===normalized?120:id.startsWith(normalized)?70:0)+(title===normalized?100:title.startsWith(normalized)?50:0)+tokens.reduce((n,t)=>n+(title.includes(t)?12:0),0);
    hits.push({row,score});
  }
  hits.sort((a,b)=>b.score-a.score||a.row.kind.localeCompare(b.row.kind)||a.row.id.localeCompare(b.row.id));
  const pages=Math.ceil(hits.length/20),current=Math.min(Math.max(1,Number.isSafeInteger(page)?page:1),Math.max(1,pages));
  return {total:hits.length,items:hits.slice((current-1)*20,current*20).map(x=>x.row),page:current,pages};
}
