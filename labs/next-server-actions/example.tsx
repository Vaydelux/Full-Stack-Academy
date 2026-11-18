import React from 'react';
import {z} from 'zod';
// Example Server Action in a Server Component module; authentication omitted on purpose.
async function validateDraft(form:FormData){'use server';const parsed=z.object({name:z.string().min(2)}).safeParse({name:form.get('name')});if(!parsed.success)return {ok:false} as const;return {ok:true} as const;}
export default function DraftPage(){return <main><h1>Draft</h1><form action={validateDraft}><label>Name <input name="name" /></label><button type="submit">Validate</button></form></main>;}
