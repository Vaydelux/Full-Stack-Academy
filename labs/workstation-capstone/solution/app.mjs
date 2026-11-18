import {pathToFileURL} from 'node:url';
export function config(env) {
  const port=env.PORT??'3100';
  if(!/^\d+$/.test(port)||Number(port)<1||Number(port)>65535)throw new Error('Invalid PORT');
  const mode=env.APP_MODE??'development';
  if(!['development','test','production'].includes(mode))throw new Error('Invalid APP_MODE');
  return {port:Number(port),mode};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const value=config(process.env);
  console.log('Ready on '+value.port+' ('+value.mode+')');
}

