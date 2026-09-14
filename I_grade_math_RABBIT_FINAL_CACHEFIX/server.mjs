import http from 'node:http';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 8080);
const host = '0.0.0.0';
const types = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon',
  '.woff':'font/woff', '.woff2':'font/woff2'
};

const server=http.createServer((req,res)=>{
  if(req.url==='/healthz'){res.writeHead(200,{'content-type':'text/plain'});res.end('ok');return;}
  const raw=(req.url||'/').split('?')[0];
  let rel=decodeURIComponent(raw);
  if(rel==='/'||rel==='')rel='/index.html';
  const safe=normalize(rel).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  let file=join(root,safe);
  if(!file.startsWith(root)){res.writeHead(403);res.end('Forbidden');return;}
  if(!existsSync(file)||!statSync(file).isFile()) file=join(root,'index.html');
  const ext=extname(file).toLowerCase();
  const headers={'content-type':types[ext]||'application/octet-stream'};
  if(/\.(png|jpe?g|webp|svg|woff2?)$/i.test(ext)) headers['cache-control']='public, max-age=31536000, immutable';
  else headers['cache-control']='no-cache';
  res.writeHead(200,headers);
  createReadStream(file).pipe(res);
});
server.listen(port,host,()=>console.log(`Serving ${root} on http://${host}:${port}`));
