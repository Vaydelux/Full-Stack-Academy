import { useState } from 'react';
import { useForm } from 'react-hook-form';
export default function TitleForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<{ title: string }>({ defaultValues: { title: '' } });
  const [submitted, setSubmitted] = useState('');
  return <form onSubmit={handleSubmit(v => setSubmitted(v.title))}>
    <label htmlFor="title">Task title</label>
    <input id="title" {...register('title', {
      required: 'Enter a task title',
      minLength: { value: 3, message: 'Enter at least 3 characters' },
      maxLength: { value: 100, message: 'Enter 100 characters or fewer' },
    })}
      aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />
    {errors.title && <p id="title-error" role="alert">{errors.title.message ?? 'Invalid title'}</p>}
    <button type="submit">Save</button>
    <output>{submitted}</output>
  </form>;
}
