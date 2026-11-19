import {useReducer} from 'react';
export type Flow={accepted:boolean;stage:'editing'|'complete'};
export type FlowAction={type:'toggle'}|{type:'submit'};
export function flowReducer(state:Flow,action:FlowAction):Flow{
 if(action.type==='toggle')return {...state,accepted:!state.accepted};
 if(action.type==='submit'&&state.accepted)return {...state,stage:'complete'};
 return state;
}
export function CheckoutFlow(){
 const [state,dispatch]=useReducer(flowReducer,{accepted:false,stage:'editing'});
 return <section><label><input type="checkbox" checked={state.accepted} onChange={()=>dispatch({type:'toggle'})}/>Accept terms</label>
 <button type="button" disabled={!state.accepted||state.stage==='complete'} onClick={()=>dispatch({type:'submit'})}>Submit order</button>
 <p role="status">{state.stage==='complete'?'Order confirmed':'Order pending'}</p></section>;
}
