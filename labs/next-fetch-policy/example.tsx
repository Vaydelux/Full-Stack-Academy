// Example server-side data helper: explicit uncached fetch avoids framework default ambiguity.
export async function readCurrentStatus(){const response=await fetch('https://example.invalid/status',{cache:'no-store'});if(!response.ok)throw new Error('Status unavailable');return response.json() as Promise<unknown>;}
