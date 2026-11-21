import { useState } from 'react';
import { useForm } from 'react-hook-form';
export default function PreviewForm(){
 const [preview,setPreview]=useState('Saved title');
 const {register,handleSubmit}=useForm<{title:string}>({defaultValues:{title:''}});
 return <form onSubmit={handleSubmit(console.log)}>
  <label>Title<input {...register('title')}/></label>
  <p>Preview: {preview}</p><button onClick={()=>setPreview('Changed')}>Change preview</button>
  <button type="submit">Save</button>
 </form>;
}
