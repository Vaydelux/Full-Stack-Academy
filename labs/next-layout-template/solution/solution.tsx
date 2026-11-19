import type {ReactNode} from 'react';
export function PortalShell({children}:{children:ReactNode}){
 return <div><nav aria-label="Main navigation">Academy</nav><main>{children}</main></div>;
}
