// Netlify Function: update-products
// Commits data/products.json to GitHub via Contents API
// Required env vars:
// - GITHUB_TOKEN: Personal Access Token with repo contents:write
// - GITHUB_REPO: "owner/repo"
// - GITHUB_BRANCH: e.g. "main"
// - PRODUCTS_PATH: optional, default "Bkshoes/data/products.json"

module.exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { products } = JSON.parse(event.body || '{}');
    if (!Array.isArray(products)) {
      return { statusCode: 400, body: 'Invalid payload: products[] required' };
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // owner/repo
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = process.env.PRODUCTS_PATH || 'Bkshoes/data/products.json';

    if (!token || !repo) {
      return { statusCode: 500, body: 'Missing GITHUB_TOKEN or GITHUB_REPO env vars' };
    }

    const apiBase = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filePath)}`;

    // Get current file to obtain SHA (required for update)
    const getResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-function' }
    });

    let sha = undefined;
    if (getResp.ok) {
      const current = await getResp.json();
      sha = current.sha;
    }

    const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');

    const putResp = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'netlify-function',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'chore: update products.json via Netlify function',
        content,
        sha,
        branch
      })
    });

    if (!putResp.ok) {
      const txt = await putResp.text();
      return { statusCode: 502, body: `GitHub update failed: ${txt}` };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e.message}` };
  }
}
