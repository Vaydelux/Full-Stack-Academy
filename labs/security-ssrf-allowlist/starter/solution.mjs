export function allowedUpstream(raw,allowedHosts){
 return allowedHosts.some(host=>String(raw).includes(host));
}
