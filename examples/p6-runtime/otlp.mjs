import assert from 'node:assert/strict';
// Minimal OTLP/HTTP JSON teaching exporter, not the OpenTelemetry SDK or a production batch processor.
export async function exportSpan(endpoint,{trace,route,status,startNs,endNs},fetcher=fetch){
 const u=new URL(endpoint);assert.ok(u.protocol==='http:'&&u.hostname==='127.0.0.1'&&u.port&&u.pathname==='/v1/traces'&&!u.search&&!u.hash&&!u.username&&!u.password,'Local OTLP trace endpoint required');
 assert.match(trace.traceId,/^[a-f0-9]{32}$/);assert.match(trace.spanId,/^[a-f0-9]{16}$/);assert.ok(!/^0+$/.test(trace.traceId)&&!/^0+$/.test(trace.spanId));
 if(trace.parentSpanId!==null){assert.match(trace.parentSpanId,/^[a-f0-9]{16}$/);assert.ok(!/^0+$/.test(trace.parentSpanId));}
 assert.ok(['/health','/ready','/events','/work','/metrics','unknown'].includes(route)&&Number.isInteger(status)&&status>=100&&status<=599&&typeof startNs==='bigint'&&typeof endNs==='bigint'&&startNs>0n&&endNs>=startNs);
 const span={traceId:trace.traceId,spanId:trace.spanId,...(trace.parentSpanId?{parentSpanId:trace.parentSpanId}:{}),name:'GET '+route,kind:2,startTimeUnixNano:String(startNs),endTimeUnixNano:String(endNs),attributes:[{key:'http.route',value:{stringValue:route}},{key:'http.response.status_code',value:{intValue:String(status)}}],status:{code:status>=500?2:0}};
 const payload={resourceSpans:[{resource:{attributes:[{key:'service.name',value:{stringValue:'academy-operations-lab'}}]},scopeSpans:[{scope:{name:'academy.educational'},spans:[span]}]}]};
 const res=await fetcher(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),redirect:'error',signal:AbortSignal.timeout(3000)});
 assert.equal(res.status,200,'OTLP export failed');const body=await res.json();assert.equal(Number(body.partialSuccess?.rejectedSpans??0),0,'Collector rejected span');return {accepted:true};
}
