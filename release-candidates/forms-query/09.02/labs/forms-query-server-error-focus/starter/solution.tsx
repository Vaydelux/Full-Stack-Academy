import { useForm } from 'react-hook-form';
export default function ErrorForm(){
 const {register,handleSubmit}=useForm<{title:string}>();
 return <form onSubmit={handleSubmit(async ({title})=>{
  await fetch('/api/tasks',{method:'POST',body:JSON.stringify({title})});
  alert('Saved'); // wrong: HTTP 422 still resolves
 })}><input aria-label="Task title" {...register('title')}/><button>Save</button></form>;
}
