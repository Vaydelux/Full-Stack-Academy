import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
const PRIVATE_VALUE = 'server-only-demo-value'; // synthetic sentinel, not a real secret
export function createApp() {
  return createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Runtime lab</title><body><h1>Runtime boundary</h1><button id="action">Try browser code</button><p id="result"></p><script src="/app.js" defer></script></body></html>');
    }
    if (req.method === 'GET' && req.url === '/app.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      return res.end("document.querySelector('#action').addEventListener('click', () => { document.querySelector('#result').textContent = 'Browser code ran'; });");
    }
    if (req.method === 'GET' && req.url === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ready: PRIVATE_VALUE.length > 0 }));
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(3101, '127.0.0.1', () => console.log('http://127.0.0.1:3101'));
}
