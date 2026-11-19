import {useActionState} from 'react';
export type FeedbackResult={ok:boolean;message:string};
export async function checkFeedback(_previous:FeedbackResult,_data:FormData):Promise<FeedbackResult>{
 return {ok:true,message:'Saved locally'};
}
export function FeedbackForm(){
 const [result,action,pending]=useActionState(checkFeedback,{ok:false,message:'No submission yet'});
 return <form action={action}><label htmlFor="feedback-input">Feedback</label>
 <textarea id="feedback-input" name="feedback"/><button type="submit" disabled={pending}>Send</button>
 <p role="status">{result.message}</p></form>;
}
