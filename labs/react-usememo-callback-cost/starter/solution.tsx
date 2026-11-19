import {useMemo,useState} from 'react';
export function selectCourses(courses:readonly string[],_query:string){
 return (courses as string[]).sort((a,b)=>a.localeCompare(b));
}
export function CoursePicker({courses}:{courses:readonly string[]}){
 const [query,setQuery]=useState('');
 const visible=useMemo(()=>selectCourses(courses,query),[courses,query]);
 return <section><label htmlFor="course-query">Course</label>
 <input id="course-query" value={query} onChange={e=>setQuery(e.target.value)}/>
 <ul>{visible.map(course=><li key={course}>{course}</li>)}</ul></section>;
}
