// Minimal real OpenAPI 3.1.x -> ECMAScript client generator.
// Emits only explicit GET/POST operations for static paths from a TRUSTED checked-in spec.
// This is not a general-purpose OpenAPI code generator. It does not compile schemas,
// handle arbitrary parameters, implement OAuth flows or validate response shapes.
const METHODS=new Set(['get','post']);
const DISALLOWED=new Set(['__proto__','prototype','constructor']);
export function generateClient(document){
 if(!document||typeof document!=='object'||!/^3\.1\.\d+$/.test(document.openapi??''))throw new TypeError('OpenAPI 3.1 document required');
 if(!document.info?.title||!document.info?.version||!document.paths||typeof document.paths!=='object')throw new TypeError('Missing OpenAPI document metadata');
 const operations=[];
 const seen=new Set();
 for(const [route,methods] of Object.entries(document.paths)){
  if(!/^\/[a-z0-9/_-]*$/i.test(route)||route.includes('//'))throw new TypeError('Only static, safe API paths are supported');
  for(const [method,operation] of Object.entries(methods)){
   if(!METHODS.has(method))continue;
   const id=operation?.operationId;
   if(typeof id!=='string'||!/^[A-Za-z_$][\w$]*$/.test(id)||DISALLOWED.has(id)||seen.has(id))throw new TypeError('Invalid or duplicate operationId');
   if(!operation.responses||typeof operation.responses!=='object')throw new TypeError('Missing response contract');
   seen.add(id);
   const security=operation.security??document.security??[];
   const needsBearer=security.some(requirement=>Object.prototype.hasOwnProperty.call(requirement,'BearerAuth'));
   operations.push({id,method:method.toUpperCase(),path:route,needsBearer});
  }
 }
 if(operations.length===0)throw new TypeError('No supported API operations');
 const methods=operations.map(op=>`  ${JSON.stringify(op.id)}: ${op.method==='POST'?'(payload)':'()'} => request(${JSON.stringify(op.method)},${JSON.stringify(op.path)},${op.method==='POST'?'payload':'undefined'},${op.needsBearer})`).join(',\n');
 return `// Generated from a trusted local OpenAPI 3.1 document. No embedded credentials.
export function createClient({baseUrl,token,fetchImpl=fetch}){
 const root=new URL(baseUrl);
 if(!['http:','https:'].includes(root.protocol)||root.username||root.password||root.search||root.hash)throw new TypeError('Unsafe base URL');
 const request=async(method,path,payload,needsBearer)=>{
  if(needsBearer&&(!token||typeof token!=='string'))throw new TypeError('Missing bearer token');
  const url=new URL(path,root);
  if(url.origin!==root.origin)throw new TypeError('Cross-origin path');
  const headers={accept:'application/json'};
  if(needsBearer)headers.authorization='Bearer '+token;
  if(payload!==undefined)headers['content-type']='application/json';
  const response=await fetchImpl(url,{method,headers,body:payload===undefined?undefined:JSON.stringify(payload),redirect:'error'});
  if(!response.ok){
   const err=new Error('HTTP '+response.status);
   err.status=response.status;
   throw err;
  }
  return response.status===204?null:response.json();
 };
 return {
${methods}
 };
}
`;
}
