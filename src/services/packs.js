import { request } from './api';

const BASE = '/Pack';

function normalizePack(p) {
  if (!p) return null;
  return {
    name: p.name || '',
    description: p.description || '',
    price: typeof p.price === 'number' ? p.price : Number(p.price || 0),
    most_popular: (p.most_popular !== undefined) ? !!p.most_popular : !!p.mostPopular || false,
    active_users: typeof p.active_users === 'number' ? p.active_users : (typeof p.activeUsers === 'number' ? p.activeUsers : 0),
    id: p.id ?? p.ID ?? null,
    updatedDatetime: p.updatedDatetime ?? p.updated_at ?? null,
    _raw: p
  };
}

export async function listPacks() {
  const res = await request(`${BASE}`, { method: 'GET' });
  if (!Array.isArray(res)) return [];
  return res.map(normalizePack).filter(Boolean);
}

export async function getPack(id) {
  const res = await request(`${BASE}/${id}`, { method: 'GET' });
  return normalizePack(res);
}

export async function createPack(payload) {
  const res = await request(`${BASE}`, { method: 'POST', body: JSON.stringify(payload) });
  return normalizePack(res) || { id: Date.now(), ...payload };
}

export async function updatePack(id, payload) {
  const res = await request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return normalizePack(res) || { id, ...payload };
}

export async function deletePack(id) {
  await request(`${BASE}/${id}`, { method: 'DELETE' });
  return { ok: true };
}

export default { listPacks, getPack, createPack, updatePack, deletePack };
