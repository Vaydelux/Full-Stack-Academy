export async function fetchJson(url,{fetchImpl=fetch}={}){
 const response=await fetchImpl(url);
 return response.text();
}
