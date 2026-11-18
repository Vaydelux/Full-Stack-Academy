export async function solve(params:Promise<{slug:string}>){const {slug}=await params;if(!/^[a-z0-9-]{1,60}$/.test(slug))throw new TypeError('Invalid slug');return slug;}
