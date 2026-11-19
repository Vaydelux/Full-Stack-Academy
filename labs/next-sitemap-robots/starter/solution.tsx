export type Page={slug:string;published:boolean;public:boolean};
export function sitemapSlugs(pages:readonly Page[]){return pages.map(x=>x.slug);}
