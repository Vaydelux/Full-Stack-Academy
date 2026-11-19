import { useForm, useFieldArray } from 'react-hook-form';
type Fields={steps:{text:string}[]};
export default function StepsForm(){
 const {control,register,handleSubmit}=useForm<Fields>({defaultValues:{steps:[{text:'A'},{text:'B'}]}});
 const {fields,append,remove}=useFieldArray({control,name:'steps'});
 return <form onSubmit={handleSubmit(console.log)}>
  {fields.map((field,index)=><div key={field.id}>
   <label htmlFor={'step-'+field.id}>Step {index+1}</label>
   <input id={'step-'+field.id} {...register(`steps.${index}.text`,{required:true,maxLength:80})} />
   <button type="button" onClick={()=>remove(index)}>Remove</button>
  </div>)}
  <button type="button" disabled={fields.length>=8} onClick={()=>append({text:''})}>Add step</button>
  <button type="submit">Save</button>
 </form>;
}
