export function sessionCookie(value){
 if(typeof value!=='string'||!/^[A-Za-z0-9_-]{16,128}$/.test(value))throw new TypeError('Invalid session id');
 return '__Host-session='+value+'; Path=/; HttpOnly; Secure; SameSite=Lax';
}
