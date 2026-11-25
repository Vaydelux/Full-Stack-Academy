import {once} from 'node:events';
import {createLab} from './service.mjs';
import {measure} from './load.mjs';
const lab=createLab();lab.server.listen(0,'127.0.0.1');await once(lab.server,'listening');
try{const report=await measure('http://127.0.0.1:'+lab.server.address().port);console.log(JSON.stringify({...report,environment:'synthetic loopback only',publicationApproved:false},null,2));if(!report.pass)process.exitCode=1;}finally{await lab.shutdown();}
