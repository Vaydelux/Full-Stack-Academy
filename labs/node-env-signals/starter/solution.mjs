export function readConfig(env){
 return {port:Number(env.PORT??3000),mode:env.NODE_ENV??'development'};
}
