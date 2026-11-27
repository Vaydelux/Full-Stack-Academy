import assert from 'node:assert/strict';
// Storage versions can expose legacy JSON statusCode or the newer error code.
const rules={authorization:{status:[401,403,404],code:/^(AccessDenied|Unauthorized|NoSuchKey|not_found|unauthorized)$/i,message:/row.level security|permission denied|unauthorized|not authorized|access denied|not found/i},mime:{status:[400,415],code:/^(InvalidMimeType|UnsupportedMediaType)$/i,message:/mime type|content.type|media type/i},size:{status:[400,413],code:/^(EntityTooLarge|PayloadTooLarge|FileSizeLimitExceeded)$/i,message:/too large|maximum.*size|size limit|exceeds.*size/i}};
export async function assertStorageRejection(response,kind){
 const rule=rules[kind];assert.ok(rule&&Object.hasOwn(rules,kind),'Unknown rejection kind');assert.ok([...rule.status,400].includes(response.status),'Unexpected Storage HTTP status');
 let body;try{body=await response.json();}catch{throw Error('Missing Storage error envelope');}
 const status=Number(body.statusCode??response.status),code=String(body.code??body.error??''),message=String(body.message??'');
 assert.ok(rule.status.includes(status)||status===400,'Unexpected Storage error status');
 assert.ok(rule.code.test(code)||rule.message.test(message),'Unexpected Storage error reason');
}
