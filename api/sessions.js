const { put, list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'sessions.json' });
      if (!blobs.length) return res.json({ sessions: [] });
      const r = await fetch(blobs[0].url);
      const data = await r.json();
      return res.json(data);
    } catch { return res.json({ sessions: [] }); }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body !== 'string') body = JSON.stringify(body);
      await put('sessions.json', body, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false
      });
      return res.json({ ok: true });
    } catch(e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
};
