export function json(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers });
}
export async function handle(request) {
  const path = new URL(request.url).pathname;
  if (path !== '/api/tasks') return json({error:'Not found'},404);
  if (request.method === 'GET') return json({tasks:[]});
  if (request.method !== 'POST') return json({error:'Method not allowed'},405,{Allow:'GET, POST'});
  return createTask(request);
}
async function createTask(request) {
  const media = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (media !== 'application/json') return json({error:'JSON required'},415);
  let body;
  try { body = await request.json(); } catch { return json({error:'Malformed JSON'},400); }
  if (!body || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 120) return json({error:'Invalid title'},400);
  return json({id:'demo',title:body.title.trim()},201);
}
