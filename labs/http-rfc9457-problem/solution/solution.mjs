export function problemResponse(status,title,_internal){
 if(!Number.isInteger(status)||status<400||status>599)throw new RangeError('Invalid status');
 return new Response(JSON.stringify({type:'about:blank',title:String(title),status}),{
  status,headers:{'content-type':'application/problem+json','cache-control':'no-store'},
 });
}
