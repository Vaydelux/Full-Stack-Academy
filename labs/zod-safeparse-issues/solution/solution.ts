import * as z from 'zod';
const Signup=z.strictObject({email:z.email(),age:z.number().int().min(18)});
export function validateSignup(input:unknown){
 const parsed=Signup.safeParse(input);
 if(parsed.success)return {ok:true as const,data:parsed.data,issues:[]};
 return {ok:false as const,issues:parsed.error.issues.map(issue=>({
  path:issue.path.map(String).join('.'),message:issue.message,
 }))};
}
