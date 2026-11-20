import { useForm } from 'react-hook-form';
export default function ErrorForm(){
 const {register,handleSubmit,setError,setFocus,formState:{errors}}=useForm<{title:string}>({defaultValues:{title:''}});
 return <form onSubmit={handleSubmit(async ({title})=>{
  try{
   const response=await fetch('/api/tasks',{method:'POST',headers:{
    'content-type':'application/json','idempotency-key':crypto.randomUUID()
   },body:JSON.stringify({title,priority:'normal'})});
   if(response.status===422){
    setError('title',{type:'server',message:'Title must be between 3 and 100 characters'});
    setFocus('title');return;
   }
   if(!response.ok)throw Error('HTTP '+response.status);
  }catch{setError('root.server',{message:'Could not save. Retry after checking the connection.'});}
 })}>
  <label htmlFor="task-title">Task title</label>
  <input id="task-title" {...register('title',{required:true})}
   aria-invalid={!!errors.title} aria-describedby={errors.title?'title-error':undefined}/>
  {errors.title&&<p id="title-error" role="alert">{errors.title.message}</p>}
  {errors.root?.server&&<p role="alert">{errors.root.server.message}</p>}
  <button>Save</button>
 </form>;
}
