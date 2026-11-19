export function safeJsonLd(value:unknown){
 return JSON.stringify(value).split('<').join(String.fromCharCode(92)+'u003c');
}
