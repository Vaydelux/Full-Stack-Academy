export function fieldAria(id:string,error:string|null){const invalid=Boolean(error?.trim());return {'aria-invalid':invalid,'aria-describedby':invalid?id+'-error':undefined};}
