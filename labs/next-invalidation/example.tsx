import {updateTag,revalidateTag} from 'next/cache';
// Demonstration only: real persistence/authorization must run before this action.
export async function afterAuthorizedPublish(){'use server';updateTag('catalog:academy');}
export async function backgroundCatalogRefresh(){revalidateTag('catalog:academy','max');}
