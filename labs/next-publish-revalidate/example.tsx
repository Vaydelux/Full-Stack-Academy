import {z} from 'zod';
import {updateTag} from 'next/cache';
// No trusted identity provider or database is configured in this teaching fixture.
// The persistence stub deliberately fails closed; wire authorization and a real write before release.
async function persistAuthorizedDraft(_title:string):Promise<boolean>{return false;}
export async function validatePublish(form:FormData){'use server';const result=z.object({title:z.string().min(2)}).safeParse({title:form.get('title')});if(!result.success)return {ok:false} as const;const persisted=await persistAuthorizedDraft(result.data.title);if(!persisted)return {ok:false} as const;updateTag('catalog:academy');return {ok:true} as const;}
