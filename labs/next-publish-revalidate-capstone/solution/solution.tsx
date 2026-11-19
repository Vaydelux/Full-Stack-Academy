export type Post={id:string;ownerId:string;title:string;revision:number};
export function publishPost(post:Post,actor:string,title:string):Post|null{
 if(post.ownerId!==actor||!title.trim()||title.trim().length>120)return null;
 return {...post,title:title.trim(),revision:post.revision+1};
}
