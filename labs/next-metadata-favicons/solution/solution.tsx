export type GuideMeta={title:string;description:string};
export function metadataForGuide(slug:string):GuideMeta{
 const titles:Record<string,string>={react:'React guide',nextjs:'Next.js guide'};
 const title=titles[slug];
 if(!title)throw new Error('Unknown guide');
 return {title:`${title} | Academy`,description:`Learn ${title} with practical examples.`};
}
