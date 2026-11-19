export function readConfig(env){
 const raw=env.PORT??'3000';
 if(!/^[0-9]+$/.test(raw))throw new Error('Invalid PORT');
 const port=Number(raw);
 if(!Number.isSafeInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
 const mode=env.NODE_ENV??'development';
 if(!['development','test','production'].includes(mode))throw new Error('Invalid NODE_ENV');
 return {port,mode};
}
