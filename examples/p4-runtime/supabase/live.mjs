/** Actual Auth, REST and Storage API checks. No privileged API credentials. */
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {supabaseConfig} from '../guard.mjs';
import {makeApi,assertDenied,assertRows} from './http.mjs';
import {assertStorageRejection} from './storage-denial.mjs';
const config=supabaseConfig(),api=makeApi(config);
const a=await api.login(config.users[0]),b=await api.login(config.users[1]);assert.notEqual(a.id,b.id,'Distinct verified users required');
const id=randomUUID(),idB=randomUUID(),table='/rest/v1/academy_runtime_documents',select='&select=id,owner_id,title';
const query=id=>table+'?id=eq.'+id+select;
const insert=(actor,id,owner,title)=>api.request(table,{method:'POST',token:actor.token,body:{id,owner_id:owner,title},headers:{Prefer:'return=representation'}});
const read=(actor,id)=>api.request(query(id),{token:actor.token});
const mutate=(actor,id,method,body)=>api.request(query(id),{method,token:actor.token,body,headers:{Prefer:'return=representation'}});
const bucket='academy-runtime-private',object=a.id+'/'+id+'.txt',objectPath='/storage/v1/object/'+bucket+'/'+object,downloadPath='/storage/v1/object/authenticated/'+bucket+'/'+object;
let uploaded=false;
const extraPaths=['foreign','mime','size'].map(kind=>a.id+'/'+id+'-'+kind+'.txt');
const uploadExtra=(actor,path,body,mime)=>api.request('/storage/v1/object/'+bucket+'/'+path,{method:'POST',token:actor.token,body,headers:{'Content-Type':mime,'x-upsert':'false'}});
const removeObjects=(actor,paths)=>api.request('/storage/v1/object/'+bucket,{method:'DELETE',token:actor.token,body:{prefixes:paths}});
try{
 const ra=await insert(a,id,a.id,'Alpha');assert.equal(ra.status,201,'Owner insert failed');
 const rb=await insert(b,idB,b.id,'Beta');assert.equal(rb.status,201,'Second owner insert failed');
 const alpha={id,owner_id:a.id,title:'Alpha'},beta={id:idB,owner_id:b.id,title:'Beta'};
 await assertRows(await read(a,id),[alpha]);await assertRows(await read(b,idB),[beta]);
 await assertRows(await read(a,idB),[]);await assertRows(await read(b,id),[]);
 assertDenied(await insert(b,randomUUID(),a.id,'forged'));
 assertDenied(await mutate(a,id,'PATCH',{owner_id:b.id}));
 await assertRows(await mutate(b,id,'PATCH',{title:'forged'}),[]);
 await assertRows(await mutate(b,id,'DELETE'),[]);
 await assertRows(await mutate(a,id,'PATCH',{title:'Updated'}),[{...alpha,title:'Updated'}]);
 await assertRows(await read(b,idB),[beta]);
 const upload=await api.request(objectPath,{method:'POST',token:a.token,body:'synthetic academy file',headers:{'Content-Type':'text/plain','x-upsert':'false'}});
 assert.ok([200,201].includes(upload.status),'Owner storage upload failed');uploaded=true;
 const own=await api.request(downloadPath,{token:a.token});assert.equal(own.status,200,'Owner download failed');assert.equal(await own.text(),'synthetic academy file');
 // Storage intentionally conceals some inaccessible objects as 404. Positive read proves the object exists.
 const denied=await api.request(downloadPath,{token:b.token});assert.ok([401,403,404].includes(denied.status),'Foreign storage download not denied');
 const signed=await api.request('/storage/v1/object/sign/'+bucket+'/'+object,{method:'POST',token:a.token,body:{expiresIn:30}});assert.equal(signed.status,200,'Owner signing failed');
 const signData=await signed.json();assert.ok(typeof signData.signedURL==='string','Missing signed URL');
 const foreignSign=await api.request('/storage/v1/object/sign/'+bucket+'/'+object,{method:'POST',token:b.token,body:{expiresIn:30}});assert.ok([401,403,404].includes(foreignSign.status),'Foreign storage signing not denied');
 const anonymous=await api.request(query(id));assertDenied(anonymous);
 assertDenied(await api.request(query(id),{token:'invalid.synthetic.token'}));
 await assertStorageRejection(await uploadExtra(b,extraPaths[0],'foreign','text/plain'),'authorization');
 await assertStorageRejection(await uploadExtra(a,extraPaths[1],'{}','application/json'),'mime');
 await assertStorageRejection(await uploadExtra(a,extraPaths[2],'x'.repeat(1025),'text/plain'),'size');
 const foreignDelete=await removeObjects(b,[object]);
 if(foreignDelete.status===200){assert.deepEqual(await foreignDelete.json(),[],'Foreign deletion returned objects');}
 else await assertStorageRejection(foreignDelete,'authorization');
 const still=await api.request(downloadPath,{token:a.token});assert.equal(still.status,200);assert.equal(await still.text(),'synthetic academy file');
 const ownerDelete=await removeObjects(a,[object]);assert.equal(ownerDelete.status,200,'Owner deletion failed');
 const removed=await ownerDelete.json();assert.ok(Array.isArray(removed)&&removed.length===1,'Owner deletion did not return the expected object');uploaded=false;
 await assertStorageRejection(await api.request(downloadPath,{token:a.token}),'authorization');
 for(const path of extraPaths){await assertStorageRejection(await api.request('/storage/v1/object/authenticated/'+bucket+'/'+path,{token:a.token}),'authorization');}
 console.log('Real local Auth, two-user REST RLS, private Storage read and signing checks passed. No Realtime or publication qualification claimed.');
}finally{
 // Only remove exact UUID-scoped artifacts from this test. Never directly delete storage metadata.
 const failures=[];
 try{const removed=await removeObjects(a,[...(uploaded?[object]:[]),...extraPaths]);if(removed.status!==200)failures.push('storage');}catch{failures.push('storage');}
 for(const [actor,record] of [[a,id],[b,idB]]){try{const removed=await mutate(actor,record,'DELETE');if(removed.status!==200)failures.push('document');}catch{failures.push('document');}}
 assert.equal(failures.length,0,'Local fixture cleanup failed; discard the disposable stack');
}
