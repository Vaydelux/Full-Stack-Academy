export function isSecureRequest(request,_trustedProxyIps=[]){
 return Boolean(request.encrypted)||request.headers['x-forwarded-proto']==='https';
}
