export function installShutdown(signals,close){
 const callback=()=>close();
 signals.on('SIGTERM',callback);signals.on('SIGINT',callback);
 return ()=>{};
}
