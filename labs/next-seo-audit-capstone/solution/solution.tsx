export type Page={id:string;published:boolean;index:boolean;canonical:string;description:string};
export function auditPages(pages:readonly Page[]):string[]{
 const issues:string[]=[];const canonical=new Set<string>();
 for(const page of pages){
  if(!page.published&&page.index)issues.push(page.id+':draft-indexed');
  if(page.published&&page.index){
   if(!page.description.trim())issues.push(page.id+':missing-description');
   if(!page.canonical.startsWith('https://'))issues.push(page.id+':invalid-canonical');
   if(canonical.has(page.canonical))issues.push(page.id+':duplicate-canonical');
   canonical.add(page.canonical);
  }
 }
 return issues;
}
