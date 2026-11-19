export type Todo={id:string;text:string;done:boolean};
export type Action={type:'add';item:Todo}|{type:'toggle';id:string}|{type:'remove';id:string};
export function todoReducer(state:readonly Todo[],_action:Action):readonly Todo[] {return state;}
