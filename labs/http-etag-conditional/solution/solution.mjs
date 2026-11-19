import {createHash} from 'node:crypto';
export function conditionalJson(data,ifNoneMatch=''){
 const body=JSON.stringify(data);
 const etag='"'+createHash('sha256').update(body).digest('hex')+'"';
 const options={'etag':etag,'cache-control':'private, no-cache'};
 const matches=String(ifNoneMatch).split(',').map(x=>x.trim().replace(/^W\//,'')).some(x=>x===etag||x==='*');
 if(matches)return new Response(null,{status:304,headers:options});
 return new Response(body,{status:200,headers:{...options,'content-type':'application/json'}});
}
