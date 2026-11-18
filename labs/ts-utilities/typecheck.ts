import {solve} from './solution/solution';
const publicUser=solve({id:'u',name:'Ada',secret:'secret'});
const id:string=publicUser.id;void id;
// @ts-expect-error public projection must not expose secret
publicUser.secret;
