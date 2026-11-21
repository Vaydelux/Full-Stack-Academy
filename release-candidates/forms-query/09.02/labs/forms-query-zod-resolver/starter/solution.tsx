import { useForm } from 'react-hook-form';
export default function TaskForm(){
 const {register,handleSubmit}=useForm<{title:string;priority:'low'|'normal'|'high'}>();
 return <form onSubmit={handleSubmit(console.log)}>
  <input aria-label="Title" {...register('title')} />
  <select aria-label="Priority" {...register('priority')}><option value="normal">Normal</option></select>
  <button>Submit</button>
 </form>;
}
