import {createStore} from 'zustand/vanilla';
import {persist,createJSONStorage} from 'zustand/middleware';
import type {StateStorage} from 'zustand/middleware';
type Theme='light'|'dark';
export type PrefState={theme:Theme;token:string;setTheme:(theme:Theme)=>void;setToken:(token:string)=>void};
type UnsafePersisted={theme:Theme;token:string};
export function makePrefsStore(storage:StateStorage){
 return createStore<PrefState>()(persist<PrefState,UnsafePersisted>(set=>({
  theme:'light',token:'',setTheme:theme=>set({theme}),setToken:token=>set({token}),
 }),{name:'academy-ui-preferences',storage:createJSONStorage<UnsafePersisted>(()=>storage),skipHydration:true,
 partialize:state=>({theme:state.theme,token:state.token})}));
}
