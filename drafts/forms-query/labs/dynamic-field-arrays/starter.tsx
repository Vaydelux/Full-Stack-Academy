import { useForm, useFieldArray } from 'react-hook-form';
type Fields={steps:{text:string}[]};
export default function StepsForm(){
 const {control,register}=useForm<Fields>({defaultValues:{steps:[{text:'A'},{text:'B'}]}});
 const {fields,append,remove}=useFieldArray({control,name:'steps'});
 return <div>{fields.map((field,index)=><div key={index}>
  <input aria-label={'Step '+(index+1)} {...register(`steps.${index}.text`)} />
  <button type="button" onClick={()=>remove(index)}>Remove</button>
 </div>)}<button type="button" onClick={()=>append({text:''})}>Add</button></div>;
}
