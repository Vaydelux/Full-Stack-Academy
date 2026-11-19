export function courseTag(id:string){
 if(!/^[a-z0-9-]{1,50}$/.test(id))throw new Error('Invalid course ID');
 return 'courses:'+id;
}
