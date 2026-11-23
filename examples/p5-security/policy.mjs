// Educational fixtures only. Authentication and real DB isolation are out of scope.
export function authorize({principal, resource, action}) {
 if (!principal?.active || !resource || !Array.isArray(principal.memberships)) return false;
 const m=principal.memberships.find(x=>x?.active===true && x.tenantId===resource.tenantId);
 if (!m || resource.deleted===true || (resource.locked===true && action==="write")) return false;
 const matrix={viewer:["read"],editor:["read","write"],owner:["read","write","delete"]};
 return Object.hasOwn(matrix,m.role) && matrix[m.role].includes(action);
}
export function findAuthorized({principal,records,id,action="read"}){
 if(typeof id!=="string" || !Array.isArray(records))return null;
 const record=records.find(x=>x?.id===id);
 return record && authorize({principal,resource:record,action}) ? record : null;
}
export function auditFields(e){
 if(!e||typeof e!=="object")return {};
 const out={};
 for(const key of ["action","result","resourceType","correlationId"]){
  if(typeof e[key]==="string")out[key]=e[key].slice(0,120).replace(/bearer\s+[^\s]+/gi,"Bearer [REDACTED]");
 }
 return out;
}
export function allowlistedHttpsUrl(raw,allowedHosts){
 if(typeof raw!=="string"||!Array.isArray(allowedHosts)||allowedHosts.length===0)return false;
 let parsed;try{parsed=new URL(raw)}catch{return false}
 if(parsed.protocol!=="https:"||parsed.username||parsed.password||(parsed.port&&parsed.port!=="443"))return false;
 const host=parsed.hostname.toLowerCase().replace(/\.$/,"");
 if(!/^[a-z0-9.-]+$/.test(host)||host.includes("..")||/^\d+\.\d+\.\d+\.\d+$/.test(host)||host==="localhost")return false;
 return allowedHosts.some(allowed=>typeof allowed==="string" && allowed.toLowerCase()===host);
}
