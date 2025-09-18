import { request } from './api';

const BASE = '/PackPermission';

export async function listPermissions() {
  return request(`${BASE}`, { method: 'GET' }) || [];
}

export async function createPermission(payload) {
  return request(`${BASE}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePermission(id, payload) {
  return request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export default { listPermissions, createPermission, updatePermission };
