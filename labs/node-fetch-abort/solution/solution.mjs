export async function fetchJson(url,{fetchImpl=fetch,timeoutMs=3000}={}){
 if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)throw new RangeError('Invalid timeout');
 const response=await fetchImpl(url,{signal:AbortSignal.timeout(timeoutMs),headers:{accept:'application/json'}});
 if(!response.ok)throw new Error('Upstream HTTP '+response.status);
 if(!/\bapplication\/(?:[\w.+-]*\+)?json\b/i.test(response.headers.get('content-type')??''))throw new Error('Unexpected content type');
 return response.json();
}
