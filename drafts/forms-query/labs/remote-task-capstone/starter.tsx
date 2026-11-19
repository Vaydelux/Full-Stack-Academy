import { useForm } from 'react-hook-form';
export default function NewTask(){
 const form=useForm<{title:string}>();
 return <form onSubmit={form.handleSubmit(async data=>{
  await fetch('/api/tasks',{method:'POST',body:JSON.stringify(data)});
 })}><input aria-label="Title" {...form.register('title')} /><button>Save</button></form>;
}
