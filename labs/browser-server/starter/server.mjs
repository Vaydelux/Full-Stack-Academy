import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
export function createApp() {
  return createServer((_req, res) => {
    // TODO: implement the routes in lesson 00.01.01.
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Implement this exercise');
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(3101, '127.0.0.1', () => console.log('http://127.0.0.1:3101'));
}
