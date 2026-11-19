import { useForm, useWatch } from 'react-hook-form';
export default function PreviewForm(){
 const {register,handleSubmit,control,reset}=useForm<{title:string}>({defaultValues:{title:''}});
 const preview=useWatch({control,name:'title',defaultValue:''});
 return <form onSubmit={handleSubmit(console.log)}>
  <label htmlFor="preview-title">Title</label><input id="preview-title" {...register('title',{required:true})}/>
  <p aria-live="polite">Preview: {preview}</p>
  <button type="button" onClick={()=>reset({title:''})}>Reset</button>
  <button type="submit">Save</button>
 </form>;
}
