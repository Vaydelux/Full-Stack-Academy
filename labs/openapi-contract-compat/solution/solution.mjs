export function findBreakingChanges(previous,next){
 const breaks=[];
 for(const [route,verbs] of Object.entries(previous?.paths??{})){
  for(const [method,operation] of Object.entries(verbs)){
   if(!['get','post','put','patch','delete'].includes(method))continue;
   const newer=next?.paths?.[route]?.[method];
   if(!newer){breaks.push('removed '+method.toUpperCase()+' '+route);continue;}
   for(const status of Object.keys(operation.responses??{})){
    if(/^2\d\d$/.test(status)&&!newer.responses?.[status])breaks.push('removed response '+status+' '+method.toUpperCase()+' '+route);
   }
   if(operation.requestBody?.required!==true&&newer.requestBody?.required===true)breaks.push('new required body '+method.toUpperCase()+' '+route);
  }
 }
 return breaks;
}
