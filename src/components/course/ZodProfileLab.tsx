'use client';

import {useState,type FormEvent} from 'react';
import {validateProfile,type ProfileOutput} from '@/lib/academy/zod-profile';

type FormState={
 displayName:string;
 email:string;
 age:string;
 contact:'email'|'none';
 agreed:boolean;
};
type Errors=Partial<Record<keyof FormState,string>>;
const empty:FormState={displayName:'',email:'',age:'',contact:'email',agreed:false};

export function ZodProfileLab(){
 const [form,setForm]=useState<FormState>(empty);
 const [errors,setErrors]=useState<Errors>({});
 const [result,setResult]=useState<ProfileOutput|null>(null);
 const [attempted,setAttempted]=useState(false);
 const [showCode,setShowCode]=useState(false);

 function update<K extends keyof FormState>(field:K,value:FormState[K]){
  setForm(previous=>({...previous,[field]:value}));
  setErrors(previous=>({...previous,[field]:undefined}));
  setResult(null);
  setAttempted(false);
 }
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setAttempted(true);
  const parsed=validateProfile(form);
  if(parsed.success){
   setErrors({});
   setResult(parsed.data);
   return;
  }
  const next:Errors={};
  for(const issue of parsed.error.issues){
   const field=issue.path[0];
   if(typeof field==='string'&&field in form){
    const key=field as keyof FormState;
    if(!next[key])next[key]=issue.message;
   }
  }
  setErrors(next);
  setResult(null);
 }
 function reset(){
  setForm(empty);
  setErrors({});
  setResult(null);
  setAttempted(false);
 }
 const inputStyle='w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:text-slate-100';
 const border=(error?:string)=>error?' border-red-600 dark:border-red-400':' border-slate-300 dark:border-white/20';
 function fieldError(key:keyof FormState){return errors[key]?<p id={'zod-'+key+'-error'} className="mt-1 text-sm text-red-700 dark:text-red-300">{errors[key]}</p>:null;}
 function describedBy(key:keyof FormState){return errors[key]?'zod-'+key+'-error':undefined;}

 return <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
  <form noValidate onSubmit={submit} className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6" aria-labelledby="profile-form-heading">
   <div><h2 id="profile-form-heading" className="text-xl font-bold">Profile validation</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Enter sample data to see real Zod 4 parsing and field errors. Nothing is saved or transmitted.</p></div>
   <div><label htmlFor="zod-displayName" className="mb-2 block text-sm font-semibold">Display name</label>
    <input id="zod-displayName" name="displayName" autoComplete="off" maxLength={90} value={form.displayName} onChange={e=>update('displayName',e.target.value)} aria-invalid={Boolean(errors.displayName)} aria-describedby={describedBy('displayName')} className={inputStyle+border(errors.displayName)} placeholder="Ava Mendoza"/>
    {fieldError('displayName')}</div>
   <div><label htmlFor="zod-email" className="mb-2 block text-sm font-semibold">Email (sample only)</label>
    <input id="zod-email" name="email" type="email" autoComplete="off" value={form.email} onChange={e=>update('email',e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} className={inputStyle+border(errors.email)} placeholder="ava@example.test"/>
    {fieldError('email')}</div>
   <div><label htmlFor="zod-age" className="mb-2 block text-sm font-semibold">Age</label>
    <input id="zod-age" name="age" type="text" inputMode="numeric" value={form.age} onChange={e=>update('age',e.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby={describedBy('age')} className={inputStyle+border(errors.age)} placeholder="21"/>
    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try 17, 21, or a nonnumber. Zod coerces valid numeric text.</p>{fieldError('age')}</div>
   <div><label htmlFor="zod-contact" className="mb-2 block text-sm font-semibold">Contact preference</label>
    <select id="zod-contact" name="contact" value={form.contact} onChange={e=>update('contact',e.target.value as FormState['contact'])} className={inputStyle+border(errors.contact)} aria-invalid={Boolean(errors.contact)} aria-describedby={describedBy('contact')}>
     <option value="email">Email</option><option value="none">No notifications</option>
    </select>{fieldError('contact')}</div>
   <div><label className="flex items-start gap-3 text-sm leading-6">
     <input type="checkbox" name="agreed" checked={form.agreed} onChange={e=>update('agreed',e.target.checked)} aria-invalid={Boolean(errors.agreed)} aria-describedby={describedBy('agreed')} className="mt-1 size-4 accent-cyan-700"/>
     <span>I agree to the sample profile validation rules. No account is created.</span>
    </label>{fieldError('agreed')}</div>
   {attempted&&!result&&<p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">Please correct the marked fields. No data was submitted.</p>}
   <div className="flex flex-wrap gap-3">
    <button type="submit" className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2">Validate profile</button>
    <button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 dark:border-white/20">Reset sample</button>
   </div>
  </form>
  <div className="min-w-0 space-y-5">
   <section aria-labelledby="profile-preview-title" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
    <h2 id="profile-preview-title" className="text-lg font-bold">Validated output</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Successful input is normalized and explicitly allowlisted by the strict schema. No server call is involved.</p>
    <div role="status" aria-live="polite" className="mt-4 rounded-xl bg-white p-3 dark:bg-slate-950">
     {result?<><p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Valid profile · local only</p><pre className="overflow-x-auto text-xs leading-6"><code>{JSON.stringify(result,null,2)}</code></pre></>
      :<p className="text-sm text-slate-600 dark:text-slate-300">{attempted?'Validation failed. Resolve the field messages.':'Complete the form and choose Validate profile to inspect normalized values.'}</p>}
    </div>
   </section>
   <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]" aria-labelledby="profile-code-title">
    <h2 id="profile-code-title" className="text-lg font-bold">Understand the schema</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">The profile uses a shared strict Zod object. It trims names, lowercases email, coerces age, applies default contact preference and requires consent.</p>
    <button type="button" aria-expanded={showCode} aria-controls="profile-source" onClick={()=>setShowCode(v=>!v)} className="mt-4 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold focus-visible:outline-2 dark:border-white/20">{showCode?'Hide schema example':'Show schema example'}</button>
    {showCode&&<pre id="profile-source" className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{`const ProfileSchema = z.strictObject({
  displayName: z.string().trim().min(2).max(80),
  email: z.email().transform(x => x.toLowerCase()),
  age: z.coerce.number().int().min(18).max(120),
  contact: z.enum(['email', 'none']).default('email'),
  agreed: z.literal(true),
});`}</code></pre>}
   </section>
  </div>
 </div>;
}
