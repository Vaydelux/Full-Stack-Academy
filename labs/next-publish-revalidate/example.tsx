import {z} from 'zod';
import {updateTag} from 'next/cache';
// Server Action demo: no actual database is modified by this educational fixture.
export async function validatePublish(form:FormData){'use server';const result=z.object({title:z.string().min(2)}).safeParse({title:form.get('title')});if(!result.success)return {ok:false} as const;/* Persist and authorize in real app first. */updateTag('catalog:academy');return {ok:true} as const;}
