export function listTasks(rows,{status='all',page=1,limit=2}={}){
 return rows.slice((page-1)*limit,page*limit).filter(x=>status==='all'||x.status===status);
}
