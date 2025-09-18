// Lightweight API helper for YouShop renderer
// In development (CRA) prefer the relative `/api` so the dev server proxy forwards requests
// to the backend and avoids CORS. In production/Electron use `REACT_APP_API_URL` if provided.
const API_BASE = (process.env.NODE_ENV === 'development')
  ? '/api'
  : (process.env.REACT_APP_API_URL || '/api');

async function request(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ys_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    // eslint-disable-next-line no-console
    console.debug('[api] request', { API_BASE, path, isElectronProxy: typeof window !== 'undefined' && !!(window.electronAPI && window.electronAPI.apiRequest) });
  } catch (e) {}

  // If running inside Electron and preload exposes apiRequest, use main-process proxy to avoid CORS
  if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.apiRequest) {
    const opts = { url: `${API_BASE}${path}`, method: options.method || 'GET', headers, body: options.body || null };
    const result = await window.electronAPI.apiRequest(opts);
    if (!result.ok) {
      const err = new Error(result.body && result.body.message ? result.body.message : `Request failed: ${result.status}`);
      err.status = result.status;
      err.body = result.body;
      throw err;
    }
    return result.body;
  }

  // Browser fetch path — this is subject to CORS when API_BASE is an absolute origin.
  try {
    const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options, headers });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      const err = new Error(data && data.message ? data.message : `Request failed: ${res.status}`);
      err.status = res.status;
      err.body = data;
      throw err;
    }
    return data;
  } catch (fetchErr) {
    const isLikelyCors = fetchErr instanceof TypeError || (fetchErr && fetchErr.message && fetchErr.message.toLowerCase().includes('failed to fetch'));
    if (isLikelyCors) {
      const hint = 'CORS error: the browser blocked the request. Use the Electron app (run `npm run electron-dev`), enable CORS on the backend, or ensure CRA dev proxy is used (start in dev and use relative `/api`).';
      const err = new Error(hint + ' Raw error: ' + (fetchErr && fetchErr.message ? fetchErr.message : fetchErr));
      throw err;
    }
    throw fetchErr;
  }
}

export async function login(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function me() {
  return request('/auth/me', { method: 'GET' });
}

export function setToken(token) {
  try { localStorage.setItem('ys_token', token); } catch (e) { /* ignore */ }
}

export function clearToken() {
  try { localStorage.removeItem('ys_token'); } catch (e) { /* ignore */ }
}

export { request, API_BASE };

export default { login, me, setToken, clearToken };
