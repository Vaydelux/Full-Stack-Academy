import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const routes=new Set(['/health','/ready','/events','/work','/metrics','unknown']);
const buckets=[5,10,25,50,100,250,500,1000];
export function traceContext(header){
 const match=typeof header==='string'&&/^00-([a-f0-9]{32})-([a-f0-9]{16})-([a-f0-9]{2})$/.exec(header);
 const accepted=match&& !/^0+$/.test(match[1])&&!/^0+$/.test(match[2]);
 const traceId=accepted?match[1]:randomBytes(16).toString('hex'),spanId=randomBytes(8).toString('hex');
 return {traceId,spanId,parentSpanId:accepted?match[2]:null,header:'00-'+traceId+'-'+spanId+'-01'};
}
export function telemetry({emit=()=>{}}={}){
 const series=new Map();
 return {observe({route,status,ms,trace}){
  assert.ok(routes.has(route)&&Number.isInteger(status)&&status>=100&&status<=599&&Number.isFinite(ms)&&ms>=0);
  const group=Math.floor(status/100)+'xx',key=route+'|'+group;
  const row=series.get(key)??{route,group,n:0,sum:0,buckets:buckets.map(()=>0)};row.n++;row.sum+=ms;buckets.forEach((bound,i)=>{if(ms<=bound)row.buckets[i]++;});series.set(key,row);
  emit(JSON.stringify({route,status,durationMs:ms,traceId:trace.traceId,spanId:trace.spanId}));
 },metrics(){const lines=['# TYPE academy_http_requests_total counter','# TYPE academy_http_duration_milliseconds histogram'];for(const r of series.values()){const label='route="'+r.route+'",status_class="'+r.group+'"';lines.push('academy_http_requests_total{'+label+'} '+r.n);buckets.forEach((b,i)=>lines.push('academy_http_duration_milliseconds_bucket{'+label+',le="'+b+'"} '+r.buckets[i]));lines.push('academy_http_duration_milliseconds_bucket{'+label+',le="+Inf"} '+r.n,'academy_http_duration_milliseconds_sum{'+label+'} '+r.sum,'academy_http_duration_milliseconds_count{'+label+'} '+r.n);}return lines.join('\n')+'\n';}};
}
