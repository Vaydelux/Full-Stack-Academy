export function articleMetadata(title:string,published:boolean){
 const safeTitle=title.trim()||'Untitled';
 return {title:safeTitle+' | Academy',description:'Read '+safeTitle+' on the academy.',robots:{index:published,follow:true}};
}
