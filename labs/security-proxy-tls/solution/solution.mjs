export function isSecureRequest(request,trustedProxyIps=[]){
 if(request.encrypted===true)return true;
 const trusted=trustedProxyIps.includes(request.remoteAddress);
 if(!trusted)return false;
 const value=request.headers['x-forwarded-proto'];
 return typeof value==='string'&&value.trim().toLowerCase()==='https';
}
