import {createContext,useContext,type ReactNode} from 'react';
const ThemeContext=createContext<'light'|'dark'|null>(null);
export function ThemeFrame({mode,children}:{mode:'light'|'dark';children:ReactNode}) {
 return <ThemeContext.Provider value={mode}>{children}</ThemeContext.Provider>;
}
export function ThemeLabel(){
 const mode=useContext(ThemeContext);if(mode===null)throw new Error('Missing ThemeFrame provider');
 return <p>Theme: {mode}</p>;
}
