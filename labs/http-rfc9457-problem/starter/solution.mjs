export function problemResponse(status,title,internal){
 return new Response(JSON.stringify({error:title,debug:internal}),{status});
}
