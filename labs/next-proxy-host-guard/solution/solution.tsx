export function trustedHost(host:string,allowed:readonly string[]){if(!/^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host))return false;return allowed.some(x=>host.toLowerCase()===x.toLowerCase());}
