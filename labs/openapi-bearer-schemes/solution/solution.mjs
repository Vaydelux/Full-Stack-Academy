export function secureOperations(document){
 const scheme=document?.components?.securitySchemes?.BearerAuth;
 if(scheme?.type!=='http'||scheme.scheme!=='bearer')return false;
 if(JSON.stringify(document.paths?.['/health']?.get?.security)!=='[]')return false;
 for(const method of ['get','post']){
  const list=document?.paths?.['/api/notes']?.[method]?.security;
  if(!Array.isArray(list)||!list.some(item=>Object.hasOwn(item,'BearerAuth')&&Array.isArray(item.BearerAuth)&&item.BearerAuth.length===0))return false;
 }
 return true;
}
