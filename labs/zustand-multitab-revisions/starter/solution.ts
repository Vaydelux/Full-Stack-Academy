import {createStore} from 'zustand/vanilla';
export type Message={origin:string;revision:number;theme:'light'|'dark'};
type TabState=Message&{setTheme:(theme:Message['theme'])=>void;applyRemote:(msg:Message)=>void};
export function makeTabStore(origin:string){
 return createStore<TabState>()(set=>({
  origin,revision:0,theme:'light',
  setTheme:theme=>set(state=>({theme,revision:state.revision+1})),
  applyRemote:msg=>set({theme:msg.theme,revision:msg.revision}),
 }));
}
