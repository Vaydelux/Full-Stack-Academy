import assert from 'node:assert/strict';
const valid=s=>s&&typeof s.access_token==='string'&&s.access_token.length>20&&typeof s.refresh_token==='string'&&s.refresh_token.length>10;
async function identity(c,session,user){assert.ok(valid(session),'Missing local session');const r=await c.auth.getUser(session.access_token);assert.ok(!r.error&&r.data?.user?.id===session.user?.id&&typeof r.data.user.id==='string'&&r.data.user.id.length>0&&r.data.user.email?.toLowerCase()===user.email.toLowerCase(),'Server identity mismatch');return r.data.user.id;}
async function login(c,user){const r=await c.auth.signInWithPassword(user);assert.ok(!r.error,'Local login failed');const session=r.data?.session;const id=await identity(c,session,user);return {session,id};}
async function refresh(c,session,user,id){const r=await c.auth.refreshSession({refresh_token:session.refresh_token});assert.ok(!r.error,'Session refresh failed');const next=r.data?.session;assert.equal(await identity(c,next,user),id,'Refresh changed user');assert.ok(next.refresh_token!==session.refresh_token,'Refresh token did not rotate');return next;}
export async function sessionLifecycle({current,peer,probe,user}){
 assert.ok(new Set([current,peer,probe]).size===3,'Independent clients required');
 try{
  const a=await login(current,user),b=await login(peer,user);assert.equal(a.id,b.id);assert.ok(a.session.refresh_token!==b.session.refresh_token,'Independent sessions required');
  const next=await refresh(current,a.session,user,a.id);
  const signedOut=await current.auth.signOut({scope:'local'});assert.ok(!signedOut.error,'Local sign-out failed');
  const state=await current.auth.getSession();assert.ok(!state.error&&state.data?.session===null,'Local session not cleared');
  const revoked=await probe.auth.refreshSession({refresh_token:next.refresh_token});assert.ok(revoked.error&&!revoked.data?.session,'Revoked refresh token accepted');assert.ok(['refresh_token_not_found','refresh_token_already_used','session_not_found'].includes(revoked.error.code),'Unexpected refresh failure');
  await refresh(peer,b.session,user,b.id);
  return {refreshRotated:true,localSessionCleared:true,revokedRefreshDenied:true,peerRefreshPassed:true,accessTokenImmediateRevocationClaimed:false,publicationApproved:false};
 }finally{
  const results=await Promise.allSettled([current,peer,probe].map(async c=>{const s=await c.auth.getSession();assert.ok(!s.error,'Cleanup session lookup failed');if(s.data?.session){const r=await c.auth.signOut({scope:'local'});assert.ok(!r.error,'Cleanup sign-out failed');}}));assert.ok(results.every(r=>r.status==='fulfilled'),'Disposable session cleanup failed');
 }
}
