import React,{Suspense} from 'react';
import {solve} from './solution';
class Boundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<p role="alert">{solve(new Error('hidden'))}</p>:this.props.children;}}
export function Workshop(){return <section aria-label="Error boundary"><Boundary><Suspense fallback={<p>Loading section</p>}><h2>Recoverable workspace</h2></Suspense></Boundary></section>;}
