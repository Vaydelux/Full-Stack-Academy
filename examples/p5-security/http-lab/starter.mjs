// Learner starter: deliberately incomplete, not an insecure server to deploy.
import {createServer} from "node:http";
export const createStarter=()=>createServer((_req,res)=>{res.writeHead(501,{"content-type":"application/json"});res.end(JSON.stringify({error:"exercise_incomplete"}));});
