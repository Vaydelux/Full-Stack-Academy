import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
const projects = [{ id: 'p1', name: 'Platform' }];
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
export function createApp() {
  return createServer((req, res) => {
    const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
    if (pathname !== '/api/projects') return json(res, 404, { error: 'Not found' });
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return json(res, 405, { error: 'Method not allowed' });
    }
    return json(res, 200, { projects });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(3102, '127.0.0.1', () => console.log('http://127.0.0.1:3102'));
}
