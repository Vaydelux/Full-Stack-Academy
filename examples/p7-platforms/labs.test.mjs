import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from './labs.mjs';
const state={version:0,deleted:false,value:null,seen:{}};
const op={id:'a',base:0,deleted:false,value:'task'};
const cases=[
 ['24.01',()=>m.bridgeAllowed({origin:'local',command:'camera'},'local',['camera']),()=>m.bridgeAllowed({origin:'remote',command:'camera'},'local',['camera'])],
 ['24.02',()=>m.applyOperation(state,op).version===1,()=>{assert.throws(()=>m.applyOperation(m.applyOperation(state,op),{...op,value:'other'}),/operation-conflict/);return false;}],
 ['24.03',()=>m.desktopAllowed({window:'main',command:'read'}, {main:['read']}),()=>m.desktopAllowed({window:'preview',command:'read'},{main:['read']})],
 ['24.04',()=>m.resumeQueue([{id:'a'},{id:'b'}],['a']).map(x=>x.id).join()==='b',()=>m.resumeQueue([{id:'a'}],[]).length===0],
 ['25.01',()=>m.aggregateEvents([{id:'a',type:'view'},{id:'a',type:'view'}]).view===1,()=>m.aggregateEvents([{id:'a',type:'view'}]).view===2],
 ['25.02',()=>m.citedAnswer({tenantId:'a',citations:['1']},[{id:'1',tenantId:'a'}]),()=>m.citedAnswer({tenantId:'b',citations:['1']},[{id:'1',tenantId:'a'}])],
 ['25.03',()=>m.validPoint({lat:14.5,lon:121}),()=>m.validPoint({lat:91,lon:121})],
 ['25.04',()=>m.mediaAllowed({bytes:1,pixels:2,seconds:3},{bytes:1,pixels:2,seconds:3}),()=>m.mediaAllowed({bytes:1,pixels:3,seconds:3},{bytes:1,pixels:2,seconds:3})],
 ['26.01',()=>m.enterpriseAccess({issuer:'i',audience:'a',active:true,mfa:true},{issuer:'i',audience:'a',requireMfa:true}),()=>m.enterpriseAccess({issuer:'i',audience:'a',active:true,mfa:false},{issuer:'i',audience:'a',requireMfa:true})],
 ['26.02',()=>m.entitlement({state:'active',paidUntil:10,now:9}),()=>m.entitlement({state:'active',paidUntil:10,now:10})],
 ['26.03',()=>m.retentionDecision({expiresAt:10,legalHold:false},10)==='eligible-review',()=>m.retentionDecision({expiresAt:10,legalHold:true},11)==='eligible-review'],
 ['26.04',()=>m.adminAllowed({actorTenant:'a',targetTenant:'a',role:'tenant-admin',reason:'support request'}),()=>m.adminAllowed({actorTenant:'a',targetTenant:'b',role:'tenant-admin',reason:'support request'})],
 ['27.01',()=>m.webAcceptance({scope:true,workspace:true,seo:true,accessibility:true}),()=>m.webAcceptance({scope:true,workspace:true,seo:true})],
 ['27.02',()=>m.apiAcceptance({owner:200,anonymous:401,foreign:404,secretExposed:false}),()=>m.apiAcceptance({owner:200,anonymous:401,foreign:200,secretExposed:false})],
 ['27.03',()=>m.workspaceAcceptance({created:true,uploaded:true,notified:true,isolated:true,audited:true}),()=>m.workspaceAcceptance({created:true,uploaded:true,notified:true,isolated:false,audited:true})],
 ['27.04',()=>m.productionAcceptance({build:true,security:true,rollback:true,restore:true,observability:true}),()=>m.productionAcceptance({build:true,security:true,rollback:true,restore:false,observability:true})],
 ['27.05',()=>m.defenseAcceptance({evidence:'reviewed',tradeoffs:'reviewed',recovery:'reviewed',cost:'reviewed',documentation:'reviewed'}),()=>m.defenseAcceptance({evidence:'reviewed',tradeoffs:'reviewed',recovery:'pending',cost:'reviewed',documentation:'reviewed'})]
];
for(const [id,positive,negative] of cases){test(id+' positive boundary',()=>assert.equal(positive(),true));test(id+' negative boundary',()=>assert.equal(negative(),false));}
test('24.02 exact replay is a no-op',()=>{const next=m.applyOperation(state,op);assert.equal(m.applyOperation(next,op),next);});
test('24.02 tombstone prevents stale resurrection',()=>{const next=m.applyOperation(m.applyOperation(state,op),{id:'b',base:1,deleted:true});assert.equal(next.value,null);assert.throws(()=>m.applyOperation(next,{id:'c',base:1,deleted:false,value:'old'}),/version-conflict/);});
test('25.02 empty citations rejected',()=>assert.equal(m.citedAnswer({tenantId:'a',citations:[]},[]),false));
test('26.03 invalid retention time rejected',()=>assert.throws(()=>m.retentionDecision({expiresAt:-1,legalHold:false},1),/invalid-retention/));
test('24.01 missing origin configuration fails closed',()=>assert.equal(m.bridgeAllowed({command:'camera'},undefined,['camera']),false));
test('25.01 conflicting event type rejected',()=>assert.throws(()=>m.aggregateEvents([{id:'a',type:'view'},{id:'a',type:'purchase'}]),/event-conflict/));
test('26.01 missing identity policy fails closed',()=>assert.equal(m.enterpriseAccess({active:true},{}),false));
test('26.04 absent tenant identity cannot authorize',()=>assert.equal(m.adminAllowed({role:'tenant-admin',reason:'support request'}),false));
