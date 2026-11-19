export function hasTaskContracts(document){
 const listing=document?.paths?.['/api/notes']?.get;
 const creation=document?.paths?.['/api/notes']?.post;
 return Boolean(listing?.responses?.['200']?.content?.['application/json']?.schema&&
  creation?.requestBody?.required===true&&
  creation?.requestBody?.content?.['application/json']?.schema&&
  creation?.responses?.['201']?.content?.['application/json']?.schema&&
  creation?.responses?.['422']);
}
