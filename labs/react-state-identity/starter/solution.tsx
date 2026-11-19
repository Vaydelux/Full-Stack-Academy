import {useState} from 'react';
export type Person={id:string;name:string};
export function Editor({initialText}:{initialText:string}) {
 const [text,setText]=useState(initialText);
 return <label>Draft <input value={text} onChange={e=>setText(e.target.value)}/></label>;
}
export function ProfileSwitcher({person}:{person:Person}) {
 return <section><h2>{person.name}</h2><Editor key="shared" initialText={person.name}/></section>;
}
