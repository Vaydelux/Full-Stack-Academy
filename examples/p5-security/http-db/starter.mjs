// P5 capstone student starting point; intentionally incomplete, not unsafe sample code.
// The learner must implement an independently tested storage boundary and session validation.
import {createServer} from 'node:http';
export function createStudentServer(){
 return createServer((_req,res)=>{
  res.writeHead(501,{'content-type':'application/json'});
  res.end(JSON.stringify({error:'exercise_incomplete'}));
 });
}
