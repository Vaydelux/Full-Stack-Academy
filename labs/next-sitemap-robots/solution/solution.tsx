export type Page={slug:string;published:boolean;public:boolean};
export function sitemapSlugs(pages:readonly Page[]){
 return [...new Set(pages.filter(x=>x.published&&x.public&&/^[a-z0-9-]+$/.test(x.slug)).map(x=>x.slug))];
}
