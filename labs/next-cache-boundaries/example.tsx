import {cacheLife} from 'next/cache';
// Enable cacheComponents in next.config before using use cache.
export async function getPublicTopics(){'use cache';cacheLife('hours');return [{id:'react',title:'React'}];}
