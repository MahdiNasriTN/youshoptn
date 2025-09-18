import { request } from './api';

const BASE = '/PackPermission';

export async function listPermissions() {
  return request(`${BASE}`, { method: 'GET' }) || [];
}

export async function getPermissionsForPack(packId) {
  if (typeof packId === 'undefined' || packId === null) return [];
  const q = `${BASE}?packId=${encodeURIComponent(packId)}`;
  const res = await request(q, { method: 'GET' });
  if (!res) return [];
  return Array.isArray(res) ? res : [res];
}

export async function createPermission(payload) {
  // Only send whitelisted fields to the backend. This prevents sending pack metadata.
  const allowed = ['updatedDatetime','packId','numberCommande','numberProduct','numberVariant','syncro','tracking','exchange','dashboard'];
  const body = {};
  // prefer explicit packId if provided, otherwise extract from nested pack
  const inferredPackId = payload && payload.pack ? (payload.pack.id ?? payload.packId) : payload.packId;
  if (inferredPackId != null) body.packId = inferredPackId;
  for (const key of allowed) {
    if (key === 'packId') continue; // already handled
    if (payload && Object.prototype.hasOwnProperty.call(payload, key)) {
      const val = payload[key];
      if (typeof val !== 'undefined') body[key] = val;
    }
  }
  return request(`${BASE}`, { method: 'POST', body: JSON.stringify(body) });
}

export async function updatePermission(id, payload) {
  const allowed = ['updatedDatetime','packId','numberCommande','numberProduct','numberVariant','syncro','tracking','exchange','dashboard'];
  const body = {};
  const inferredPackId = payload && payload.pack ? (payload.pack.id ?? payload.packId) : payload.packId;
  if (inferredPackId != null) body.packId = inferredPackId;
  for (const key of allowed) {
    if (key === 'packId') continue;
    if (payload && Object.prototype.hasOwnProperty.call(payload, key)) {
      const val = payload[key];
      if (typeof val !== 'undefined') body[key] = val;
    }
  }
  return request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

export default { listPermissions, getPermissionsForPack, createPermission, updatePermission };
