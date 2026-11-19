export function listTasks(rows,{status='all',page=1,limit=2,order='asc'}={}){
 if(!['all','open','done'].includes(status)||!['asc','desc'].includes(order))throw new RangeError('Invalid filter');
 if(!Number.isSafeInteger(page)||page<1||!Number.isSafeInteger(limit)||limit<1||limit>50)throw new RangeError('Invalid page');
 const filtered=rows.filter(x=>status==='all'||x.status===status);
 const sorted=[...filtered].sort((a,b)=>a.title.localeCompare(b.title)*(order==='asc'?1:-1)||String(a.id).localeCompare(String(b.id)));
 return sorted.slice((page-1)*limit,page*limit);
}
