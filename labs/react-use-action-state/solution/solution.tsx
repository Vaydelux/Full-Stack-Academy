import {useActionState} from 'react';
export type FeedbackResult={ok:boolean;message:string};
export async function checkFeedback(_previous:FeedbackResult,data:FormData):Promise<FeedbackResult>{
 const text=data.get('feedback');
 if(typeof text!=='string'||text.trim().length<3)return {ok:false,message:'Enter at least 3 characters'};
 return {ok:true,message:'Accepted local feedback'};
}
export function FeedbackForm(){
 const [result,action,pending]=useActionState(checkFeedback,{ok:false,message:'No submission yet'});
 return <form action={action}><label htmlFor="feedback-input">Feedback</label>
 <textarea id="feedback-input" name="feedback"/><button type="submit" disabled={pending}>Send</button>
 <p role="status">{result.message}</p></form>;
}
