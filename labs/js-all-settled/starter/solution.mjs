export async function solve(tasks){return await Promise.all(tasks.map(task=>task()));}
