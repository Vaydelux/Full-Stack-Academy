import {createStore} from 'zustand/vanilla';
export type Message={origin:string;revision:number;theme:'light'|'dark'};
type TabState=Message&{setTheme:(theme:Message['theme'])=>void;applyRemote:(message:Message)=>void};
export function makeTabStore(origin:string){
 return createStore<TabState>()((set,get)=>({
  origin,revision:0,theme:'light',
  setTheme:theme=>set(state=>({theme,revision:state.revision+1})),
  applyRemote:message=>{if(message.origin!==origin&&Number.isSafeInteger(message.revision)&&message.revision>get().revision){
   set({theme:message.theme,revision:message.revision});
  }},
 }));
}
