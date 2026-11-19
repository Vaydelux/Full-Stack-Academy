export type ErrorInput={requestId:string;operation:string;errorCode:string;token:string;email:string};export function sanitizeError(input:ErrorInput){return {...input};}
