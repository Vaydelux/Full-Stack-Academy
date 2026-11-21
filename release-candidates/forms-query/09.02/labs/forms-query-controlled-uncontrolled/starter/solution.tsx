import { useForm } from 'react-hook-form';
export default function TitleForm() {
  const { handleSubmit } = useForm<{title:string}>();
  return <form onSubmit={handleSubmit(console.log)}>
    <label htmlFor="title">Title</label>
    <input id="title" value="Not editable" />
    <button>Save</button>
  </form>;
}
