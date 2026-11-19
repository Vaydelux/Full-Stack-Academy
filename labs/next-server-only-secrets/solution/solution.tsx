export type ServerIdentity={id:string;displayName:string;apiCredential:string};
export function publicIdentity(row:ServerIdentity){return {id:row.id,displayName:row.displayName};}
