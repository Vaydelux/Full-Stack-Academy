import {useState} from 'react';
export function TextComposer({initial=''}:{initial?:string}) {
 const [text,setText]=useState(initial);
 return <section><label htmlFor="composer">Message</label>
  <input id="composer" value={text} onChange={e=>setText(e.target.value)}/>
  <output aria-label="Preview">{text||'Empty message'}</output></section>;
}
