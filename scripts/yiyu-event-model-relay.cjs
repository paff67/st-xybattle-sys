// Temporary loopback-only real-model relay. Config is outside the public tree.
const http = require('node:http'), fs = require('node:fs');
const config = JSON.parse(fs.readFileSync(process.env.XY_MODEL_CONFIG || '/tmp/xy-event-model.json', 'utf8'));
const endpoint = config.endpoint.replace(/\/$/, '').replace(/\/chat\/completions$/, '') + '/chat/completions';
const port = Number(process.env.XY_RELAY_PORT || 19996);
const logPath = process.env.XY_RELAY_LOG || '/tmp/xy-event-model-requests.jsonl';
let seq = 0;
http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin === 'http://127.0.0.1:18004') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  }
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.url.endsWith('/models')) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ data: [{ id: config.model, object: 'model' }] })); return; }
  let body = ''; for await (const chunk of req) body += chunk;
  try {
    const data = JSON.parse(body); data.model = config.model;
    const text = JSON.stringify(data.messages || []);
    const record = { sequence: ++seq, started: Date.now(), stream: !!data.stream, packets: (text.match(/XY_EVENT_RESULT/g) || []).length,
      routing: text.includes('事件语义分流器'), preparation: text.includes('自动资料准备器'), adjudication: text.includes('独立功法战斗裁定核心') };
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify(data), signal: AbortSignal.timeout(120000) });
    record.status = response.status;
    res.writeHead(response.status, { 'content-type': response.headers.get('content-type') || 'application/json' });
    for await (const chunk of response.body) res.write(chunk);
    res.end(); record.finished = Date.now();
    fs.appendFileSync(logPath, JSON.stringify(record) + '\n');
  } catch { res.writeHead(502); res.end(JSON.stringify({ error: 'isolated model relay failed' })); }
}).listen(port, '127.0.0.1');
