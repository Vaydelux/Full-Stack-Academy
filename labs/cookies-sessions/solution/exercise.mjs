import {randomUUID} from 'node:crypto';
export function createSessions(now = Date.now) {
  const sessions=new Map();
  return {
    create(userId,ttlMs=60000) {
      if(!Number.isSafeInteger(ttlMs)||ttlMs<=0)throw new Error('Invalid TTL');
      const id=randomUUID(); sessions.set(id,{userId,expires:now()+ttlMs}); return id;
    },
    get(id) {
      const entry=sessions.get(id);
      if(!entry||entry.expires<=now()){sessions.delete(id);return null;}
      return entry.userId;
    },
    revoke(id){sessions.delete(id);}
  };
}
export function sessionCookie(id) {
  return '__Host-academy_session='+encodeURIComponent(id)+'; Path=/; HttpOnly; Secure; SameSite=Lax';
}
export function readSession(header, sessions) {
  const matches=header.split(';').map(v=>v.trim()).filter(v=>v.startsWith('__Host-academy_session='));
  if(matches.length!==1)return null;
  try{return sessions.get(decodeURIComponent(matches[0].slice('__Host-academy_session='.length)));}
  catch{return null;}
}
