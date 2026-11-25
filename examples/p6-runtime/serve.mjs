import {createLab} from './service.mjs';
const lab=createLab({emit:line=>console.log(line)});const port=Number(process.env.ACADEMY_LAB_PORT??8080);if(!Number.isSafeInteger(port)||port<1024||port>65535)throw Error('Invalid lab port');
lab.server.listen(port,'127.0.0.1');
let closing=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{if(closing)return;closing=true;try{await lab.shutdown();}catch{process.exitCode=1;}});
