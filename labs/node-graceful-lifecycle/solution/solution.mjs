export function installShutdown(signals,close){
 let closing=false;
 const callback=()=>{
  if(closing)return;
  closing=true;
  signals.off('SIGTERM',callback);signals.off('SIGINT',callback);
  void Promise.resolve().then(close);
 };
 signals.on('SIGTERM',callback);signals.on('SIGINT',callback);
 return ()=>{
  signals.off('SIGTERM',callback);signals.off('SIGINT',callback);
 };
}
