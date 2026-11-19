export type ServerCourse={id:string;title:string;createdAt:Date;internalToken:string};
export function toClientCourse(row:ServerCourse){return {...row};}
