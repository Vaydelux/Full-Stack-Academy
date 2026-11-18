import React,{type ReactNode} from 'react';
import {solve} from './solution';
function Panel({children}:{children:ReactNode}){return <article aria-label="Card panel">{children}</article>;}
export function Workshop(){return <section><Panel><h2>Composition</h2><p>{solve(['Overview','Details'])}</p><small>Extra child content</small></Panel></section>;}
