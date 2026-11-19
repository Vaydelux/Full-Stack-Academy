export type Todo={id:string;text:string;done:boolean};
export type Action={type:'add';item:Todo}|{type:'toggle';id:string}|{type:'remove';id:string};
export function todoReducer(state:readonly Todo[],action:Action):readonly Todo[] {
 switch(action.type){
  case 'add': return state.some(x=>x.id===action.item.id)?state:[...state,action.item];
  case 'toggle': return state.map(x=>x.id===action.id?{...x,done:!x.done}:x);
  case 'remove': return state.filter(x=>x.id!==action.id);
 }
}
