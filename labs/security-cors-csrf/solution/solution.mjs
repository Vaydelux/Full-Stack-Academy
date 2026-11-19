export function checkOrigin(origin,allowed){
 const accepted=typeof origin==='string'&&allowed.includes(origin);
 return {corsOrigin:accepted?origin:null,allowCredentials:accepted,allowWrite:accepted};
}
