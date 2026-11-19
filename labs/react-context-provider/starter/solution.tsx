import {createContext,useContext,type ReactNode} from 'react';
const ThemeContext=createContext<'light'|'dark'|null>(null);
export function ThemeFrame({mode,children}:{mode:'light'|'dark';children:ReactNode}) {
 return <ThemeContext.Provider value={mode}>{children}</ThemeContext.Provider>;
}
export function ThemeLabel(){useContext(ThemeContext);return <p>Theme: light</p>;}
