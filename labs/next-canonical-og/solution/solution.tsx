export function canonicalArticleUrl(origin:string,slug:string){
 const site=new URL(origin);
 if(site.protocol!=='https:'||site.username||site.password||site.pathname!=='/'||site.search||site.hash)throw new Error('Invalid origin');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error('Invalid slug');
 return new URL('/articles/'+slug,site).toString();
}
