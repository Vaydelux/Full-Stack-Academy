import {isIP} from 'node:net';
export function allowedUpstream(raw,allowedHosts){
 try{
  const url=new URL(raw);
  if(url.protocol!=='https:'||url.username||url.password||url.port&&url.port!=='443')return false;
  const host=url.hostname.toLowerCase();
  if(isIP(host)||host==='localhost'||host.endsWith('.localhost'))return false;
  return allowedHosts.some(allowed=>host===allowed.toLowerCase());
 }catch{return false;}
}
