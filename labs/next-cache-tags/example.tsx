import {cacheTag,cacheLife} from 'next/cache';
// Cache Components example; requires cacheComponents: true.
export async function getCourseCatalog(){'use cache';cacheTag('catalog:academy');cacheLife('hours');return [{id:'react',title:'React 19'}];}
