export type Task = {id:string; title:string};
export function TaskList({tasks}:{tasks:readonly Task[]}) {
  return <ul>{tasks.map((task,index)=><li key={index}>{task.title}</li>)}</ul>;
}
