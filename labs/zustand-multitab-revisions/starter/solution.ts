import {createStore} from 'zustand/vanilla';
export type Message={origin:string;revision:number;theme:'light'|'dark'};
export function makeTabStore(origin:string){return createStore()(set=>({
 origin,revision:0,theme:'light',
 setTheme:(theme:'light'|'dark')=>set((s:any)=>({theme,revision:s.revision+1})),
 applyRemote:(msg:Message)=>set({theme:msg.theme,revision:msg.revision}),
}));}
