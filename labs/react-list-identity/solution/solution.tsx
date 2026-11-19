export type Task = {id:string; title:string};
export function TaskList({tasks}:{tasks:readonly Task[]}) {
  if(tasks.length===0) return <p role="status">No tasks yet.</p>;
  return <ul>{tasks.map(task=><li key={task.id} data-id={task.id}>{task.title}</li>)}</ul>;
}
