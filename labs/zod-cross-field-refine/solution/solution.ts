import * as z from 'zod';
export const Passwords=z.strictObject({
 password:z.string().min(8),
 confirmPassword:z.string().min(8),
}).superRefine((values,ctx)=>{
 if(values.password!==values.confirmPassword)ctx.addIssue({
  code:'custom',path:['confirmPassword'],message:'Passwords do not match',
 });
});
