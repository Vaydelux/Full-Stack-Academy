export async function readGuideSlug(params:Promise<{slug:string}>){
 const {slug}=await params;
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid guide slug');
 return slug;
}
