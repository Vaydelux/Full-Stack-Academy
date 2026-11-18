export async function probeRequest(request, now = () => performance.now()) {
  const start=now();
  try {
    const res=await request();
    return {kind:'http',status:res.status,ok:res.ok,
      durationMs:Math.max(0,Math.round(now()-start)),
      contentType:res.headers.get('content-type')};
  } catch {
    return {kind:'network-error',status:null,ok:false,
      durationMs:Math.max(0,Math.round(now()-start)),contentType:null};
  }
}
