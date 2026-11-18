export async function solve(fetcher){let response;for(let i=0;i<10;i++)response=await fetcher();return response.data;}
