export function operationIdIssues(document){
 const issues=[];const seen=new Set();
 for(const [route,verbs] of Object.entries(document?.paths??{})){
  for(const [method,operation] of Object.entries(verbs)){
   if(!['get','post','put','patch','delete'].includes(method))continue;
   const id=operation?.operationId;
   if(typeof id!=='string'||!/^[A-Za-z_$][\w$]*$/.test(id)||['__proto__','constructor','prototype'].includes(id))issues.push('invalid '+method+' '+route);
   else if(seen.has(id))issues.push('duplicate '+id);
   else seen.add(id);
  }
 }
 return issues;
}
