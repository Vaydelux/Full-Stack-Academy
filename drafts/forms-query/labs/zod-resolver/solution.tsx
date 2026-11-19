import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const Task=z.object({title:z.string().trim().min(3).max(100),priority:z.enum(['low','normal','high'])});
export default function TaskForm(){
 const {register,handleSubmit,formState:{errors}}=
  useForm<z.input<typeof Task>,unknown,z.output<typeof Task>>({
   resolver:zodResolver(Task), defaultValues:{title:'',priority:'normal'} });
 return <form onSubmit={handleSubmit(data=>console.log(data.title))}>
  <label htmlFor="task-title">Title</label><input id="task-title" {...register('title')}
   aria-invalid={Boolean(errors.title)} aria-describedby={errors.title?'title-err':undefined}/>
  {errors.title&&<p id="title-err" role="alert">{errors.title.message}</p>}
  <label htmlFor="task-priority">Priority</label><select id="task-priority" {...register('priority')}>
   <option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option></select>
  <button>Submit</button>
 </form>;
}
