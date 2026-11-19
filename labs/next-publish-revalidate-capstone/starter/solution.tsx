export type Post={id:string;ownerId:string;title:string;revision:number};
export function publishPost(post:Post,_actor:string,title:string){return {...post,title};}
