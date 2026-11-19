import {Component,Suspense,type ReactNode} from 'react';
export class RescueBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<p role="alert">Cannot show this panel.</p>:this.props.children;}
}
export function LoadingSection({children}:{children:ReactNode}){
 return <Suspense fallback={<p role="status">Loading resource…</p>}>{children}</Suspense>;
}
