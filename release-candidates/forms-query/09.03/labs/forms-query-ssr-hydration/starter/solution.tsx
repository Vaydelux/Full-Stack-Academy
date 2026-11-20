import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import TaskList from './task-list';
export default async function Page(){
 const client=new QueryClient();
 return <TaskList />; // cache never seeded; client refetches
}
