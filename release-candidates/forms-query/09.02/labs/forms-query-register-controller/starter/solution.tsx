import { useForm } from 'react-hook-form';
function Rating({ value, onChange }: {value:number;onChange:(n:number)=>void}) {
 return <button type="button" onClick={()=>onChange(value===5?1:value+1)}>Rating: {value}</button>;
}
export default function ReviewForm(){
 const { register, handleSubmit }=useForm<{title:string;rating:number}>({defaultValues:{title:'',rating:1}});
 return <form onSubmit={handleSubmit(console.log)}>
  <input aria-label="Review title" {...register('title')} />
  <Rating value={1} onChange={()=>{}} />
  <button type="submit">Save</button>
 </form>;
}
