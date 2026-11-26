import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
export const migrationDigest=bytes=>createHash('sha256').update(bytes).digest('hex');
const tables=['Membership','Task'];
const catalogSql={
 tables:`SELECT c.relname AS name,c.relkind AS kind,c.relrowsecurity AS rls,c.relforcerowsecurity AS forced_rls FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=$1 AND c.relkind IN ('r','p','v','m','f') AND c.relname<>'_prisma_migrations' ORDER BY c.relname`,
 columns:`SELECT c.relname AS table_name,a.attname AS name,a.attnum AS position,pg_catalog.format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull AS required,a.attidentity AS identity,a.attgenerated AS generated,pg_catalog.pg_get_expr(d.adbin,d.adrelid) AS default_expr FROM pg_catalog.pg_attribute a JOIN pg_catalog.pg_class c ON c.oid=a.attrelid JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum WHERE n.nspname=$1 AND c.relname=ANY($2::text[]) AND a.attnum>0 AND NOT a.attisdropped ORDER BY c.relname,a.attnum`,
 constraints:`SELECT c.relname AS table_name,k.conname AS name,k.contype AS kind,k.convalidated AS validated,k.condeferrable AS deferrable,k.condeferred AS deferred,pg_catalog.pg_get_constraintdef(k.oid,false) AS definition FROM pg_catalog.pg_constraint k JOIN pg_catalog.pg_class c ON c.oid=k.conrelid JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=$1 AND c.relname=ANY($2::text[]) ORDER BY c.relname,k.conname`,
 indexes:`SELECT c.relname AS table_name,i.relname AS name,am.amname AS method,x.indisunique AS unique_index,x.indisprimary AS primary_index,x.indisvalid AS valid,x.indisready AS ready,x.indnullsnotdistinct AS nulls_not_distinct,x.indnkeyatts AS key_count,x.indnatts AS total_count,pg_catalog.pg_get_expr(x.indpred,x.indrelid) AS predicate,ARRAY(SELECT pg_catalog.pg_get_indexdef(i.oid,k,false) FROM generate_series(1,x.indnatts) AS k ORDER BY k) AS keys FROM pg_catalog.pg_index x JOIN pg_catalog.pg_class c ON c.oid=x.indrelid JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace JOIN pg_catalog.pg_class i ON i.oid=x.indexrelid JOIN pg_catalog.pg_am am ON am.oid=i.relam WHERE n.nspname=$1 AND c.relname=ANY($2::text[]) ORDER BY c.relname,i.relname`
};
export async function captureCatalog(client,schema){
 assert.ok(schema==='public'||/^academy_drift_[a-f0-9]{32}$/.test(schema),'Invalid catalog schema');
 const snapshot={};for(const [key,sql] of Object.entries(catalogSql)){const params=key==='tables'?[schema]:[schema,tables];snapshot[key]=(await client.query(sql,params)).rows;}return snapshot;
}
export function compareCatalog(actual,expected){
 for(const snapshot of [actual,expected]){assert.deepEqual(Object.keys(snapshot).sort(),Object.keys(catalogSql).sort());assert.deepEqual(snapshot.tables.map(r=>r.name),tables,'Unexpected teaching tables');for(const key of ['columns','constraints','indexes'])assert.ok(Array.isArray(snapshot[key])&&tables.every(t=>snapshot[key].some(r=>r.table_name===t)),'Incomplete catalog '+key);}
 for(const key of Object.keys(catalogSql))assert.ok(JSON.stringify(actual[key])===JSON.stringify(expected[key]),'Schema drift: '+key);
 return {tableCount:tables.length,catalogMatches:true,scope:'teaching-tables-columns-constraints-indexes',publicationApproved:false};
}
export async function qualifyCatalog(client,migration,expectedDigest){
 assert.ok(Buffer.isBuffer(migration)&&migrationDigest(migration)===expectedDigest,'Reference migration changed; review the catalog exercise before replay');
 const schema='academy_drift_'+randomUUID().replaceAll('-','');
 await client.query('BEGIN');
 try{
  await client.query('SET LOCAL lock_timeout = 5000');await client.query('SET LOCAL statement_timeout = 10000');
  await client.query('CREATE SCHEMA '+schema);
  await client.query('SET LOCAL search_path TO '+schema+', pg_catalog');
  await client.query(migration.toString('utf8'));
  const expected=await captureCatalog(client,schema),actual=await captureCatalog(client,'public');
  const result=compareCatalog(actual,expected);
  await client.query('ALTER TABLE '+schema+'."Task" ADD COLUMN drift_probe integer');
  const changed=await captureCatalog(client,schema);assert.throws(()=>compareCatalog(actual,changed),/Schema drift: columns/);
  return {...result,negativeControlPassed:true};
 }finally{await client.query('ROLLBACK');}
}
