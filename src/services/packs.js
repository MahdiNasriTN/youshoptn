import { request } from './api';

const BASE = '/Pack';

export async function listPacks() {
  return request(`${BASE}`, { method: 'GET' });
}

export async function getPack(id) {
  return request(`${BASE}/${id}`, { method: 'GET' });
}

export async function createPack(payload) {
  return request(`${BASE}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePack(id, payload) {
  return request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deletePack(id) {
  return request(`${BASE}/${id}`, { method: 'DELETE' });
}

export default { listPacks, getPack, createPack, updatePack, deletePack };
