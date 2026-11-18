import {solve} from './solution/solution';
const result=solve({email:'hello@example.com'});
if(result.ok){const email:string=result.email;void email;}else{const error:string=result.error;void error;}
