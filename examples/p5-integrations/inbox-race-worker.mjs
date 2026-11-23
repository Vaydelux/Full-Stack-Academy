/** Child-process test fixture; invoked only by multi-process-inbox.test.mjs. */
import {DurableWebhookInbox} from './durable-inbox.mjs';
import {signWebhook} from './labs.mjs';
const [mode,filePath,id]=process.argv.slice(2);
const encryptionKey=Buffer.from(process.env.P5_RACE_TEST_KEY??'', 'hex');
const now=1000000;
let inbox;
try{inbox=new DurableWebhookInbox({filePath,encryptionKey,clock:()=>now});}
catch(error){process.send?.({ready:false,error:error.message});process.exitCode=1;}
if(inbox){
 process.send?.({ready:true});
 process.once('message',command=>{
  if(command!=='go'){process.send?.({ok:false,error:'invalid-command'});return;}
  try{
   let result;
   if(mode==='accept'){
    const body=Buffer.from('synthetic-parallel-delivery'),provider='sender',tenantId='north',eventId=id;
    const secret='synthetic-strong-webhook-signing-key';
    result=inbox.accept({provider,tenantId,eventId,body,timestamp:now,now,secret,signature:signWebhook(secret,body,now,provider,eventId)});
   }else if(mode==='claim')result=inbox.claim(id);
   else throw Error('invalid-worker-mode');
   process.send?.({ok:true,status:result?.status??'unclaimed',leaseToken:result?.leaseToken??null});
  }catch(error){process.send?.({ok:false,error:error.message});}
 });
}
