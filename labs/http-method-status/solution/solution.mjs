export function chooseStatus(method,exists){
 switch(method){
  case 'GET':case 'HEAD':return {status:exists?200:404};
  case 'POST':return {status:201};
  case 'PATCH':return {status:exists?200:404};
  case 'DELETE':return {status:exists?204:404};
  default:return {status:405,allow:'GET, HEAD, POST, PATCH, DELETE'};
 }
}
