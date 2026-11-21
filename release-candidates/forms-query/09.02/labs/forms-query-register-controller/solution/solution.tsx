import { Controller, useForm } from 'react-hook-form';
function Rating({ value, onChange }: {value:number;onChange:(n:number)=>void}) {
 return <button type="button" aria-label="Increase rating" onClick={()=>onChange(value===5?1:value+1)}>Rating: {value}</button>;
}
export default function ReviewForm(){
 const { register, control, handleSubmit }=useForm<{title:string;rating:number}>({defaultValues:{title:'',rating:1}});
 return <form onSubmit={handleSubmit(console.log)}>
  <label htmlFor="review-title">Review title</label>
  <input id="review-title" {...register('title',{required:true})} />
  <Controller name="rating" control={control} render={({field})=>
    <Rating value={field.value} onChange={field.onChange} />} />
  <button type="submit">Save</button>
 </form>;
}
