import { useForm } from 'react-hook-form';
export default function SettingsForm(){
 const {register,handleSubmit,reset}=useForm<{title:string}>({defaultValues:{title:''}});
 return <form onSubmit={handleSubmit(async data=>{
  reset(); // loses the only draft if the next request fails
  await fetch('/api/tasks',{method:'POST',body:JSON.stringify(data)});
 })}><label>Title<input {...register('title')}/></label><button>Save</button></form>;
}
