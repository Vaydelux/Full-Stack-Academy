import { useState } from 'react';
import { useForm } from 'react-hook-form';
export default function TitleForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<{ title: string }>({ defaultValues: { title: '' } });
  const [submitted, setSubmitted] = useState('');
  return <form onSubmit={handleSubmit(v => setSubmitted(v.title))}>
    <label htmlFor="title">Task title</label>
    <input id="title" {...register('title', { required: 'Required', minLength: 3, maxLength: 100 })}
      aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />
    {errors.title && <p id="title-error" role="alert">{errors.title.message ?? 'Invalid title'}</p>}
    <button type="submit">Save</button>
    <output>{submitted}</output>
  </form>;
}
