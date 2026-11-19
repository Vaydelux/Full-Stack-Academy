export function conditionalJson(data,_ifNoneMatch=''){
 return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
}
