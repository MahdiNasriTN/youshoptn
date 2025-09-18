import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import packsService from '../services/packs';
import permService from '../services/packPermissions';
import { Card, Button, Loading } from '../components/ui';

const defaultPerm = {
  id: null,
  updatedDatetime: null,
  pack: null,
  name: '',
  description: '',
  price: 0,
  most_popular: false,
  active_users: 0,
  packId: 0,
  numberCommande: 0,
  syncro: true,
  tracking: true,
  exchange: true,
  numberProduct: 0,
  numberVariant: 0,
  dashboard: ''
};

const PackPermissions = () => {
  const { state } = useApp();
  const [packs, setPacks] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [perm, setPerm] = useState(defaultPerm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [pks, perms] = await Promise.all([packsService.listPacks(), permService.listPermissions()]);
        if (!mounted) return;
        setPacks(pks || []);
        setPermissions(perms || []);
      } catch (e) {
        // ignore for now
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const getInitials = (name = '') => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const filtered = useMemo(() => {
    const q = String(search || '').trim().toLowerCase();
    if (!q) return packs;
    return packs.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }, [packs, search]);

  useEffect(() => {
    if (!selectedPack) {
      setPerm(defaultPerm);
      return;
    }
    const existing = permissions.find(p => p && p.pack && (p.pack.id === selectedPack.id || p.pack === selectedPack.id || p.pack === selectedPack.name || p.pack === selectedPack.id));
    if (existing) setPerm({ ...existing });
    else setPerm({ ...defaultPerm, pack: selectedPack, packId: selectedPack.id, name: selectedPack.name });
  }, [selectedPack, permissions]);

  const handleSave = async () => {
    if (!selectedPack) return;
    setSaving(true);
    try {
      if (perm.id) {
        await permService.updatePermission(perm.id, perm);
      } else {
        await permService.createPermission(perm);
      }
      const perms = await permService.listPermissions();
      setPermissions(perms || []);
      setPerm(prev => ({ ...prev }));
      try { window.toast && window.toast('Permissions saved'); } catch(e) { alert('Permissions saved'); }
    } catch (e) {
      try { window.toast && window.toast('Failed to save permissions', 'error'); } catch(e) { alert('Failed to save permissions'); }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!selectedPack) return;
    const existing = permissions.find(p => p && p.pack && (p.pack.id === selectedPack.id || p.pack === selectedPack.id || p.pack === selectedPack.name));
    if (existing) setPerm({ ...existing });
    else setPerm({ ...defaultPerm, pack: selectedPack, packId: selectedPack.id, name: selectedPack.name });
  };

  function formatDate(d) {
    if (!d) return '-';
    try { return new Date(d).toLocaleString(); } catch (e) { return String(d); }
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card className="p-4">
            <div className="mb-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search packs..." className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800" />
            </div>

            <div className="max-h-[60vh] overflow-auto divide-y dark:divide-gray-800">
              {loading ? (
                <div className="py-8"><Loading message="Loading packs…" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">No packs found</div>
              ) : filtered.map(p => (
                <div key={p.id} onClick={() => setSelectedPack(p)} className={`flex items-center justify-between p-3 cursor-pointer gap-3 rounded ${selectedPack && selectedPack.id === p.id ? 'bg-indigo-50 dark:bg-gray-900 ring-1 ring-indigo-300' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">{getInitials(p.name)}</div>
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-400">ID: {p.id}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    <div className="text-xs">{p.active_users ?? 0} users</div>
                    <div className="mt-1 text-xs">{p.most_popular ? <span className="text-amber-500">★</span> : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-xl font-semibold">{selectedPack ? getInitials(selectedPack.name) : 'PP'}</div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedPack ? selectedPack.name : 'Select a pack'}</h2>
                  <div className="text-sm text-gray-500 mt-1">{selectedPack ? `Pack ID: ${selectedPack.id}` : 'Select a pack on the left to edit its permissions.'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" onClick={handleReset} disabled={!selectedPack || saving}>Reset</Button>
                <Button onClick={handleSave} disabled={!selectedPack || saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="col-span-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Pack</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600">Pack Name</label>
                    <input disabled value={selectedPack ? selectedPack.name : ''} className="w-full px-3 py-3 border rounded bg-gray-50 dark:bg-gray-900 text-lg font-medium" />
                  </div>
                  <div className="text-xs text-gray-400">{selectedPack ? `Last updated: ${formatDate(perm.updatedDatetime)}` : ''}</div>
                </div>
              </section>

              <section className="col-span-1">
                <div className="text-sm font-medium text-gray-700 mb-2">Limits & Features</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600">Number of Commande</label>
                    <input type="number" value={perm.numberCommande || 0} onChange={(e) => setPerm({...perm, numberCommande: Number(e.target.value)})} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Number of Products</label>
                    <input type="number" value={perm.numberProduct || 0} onChange={(e) => setPerm({...perm, numberProduct: Number(e.target.value)})} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Number of Variants</label>
                    <input type="number" value={perm.numberVariant || 0} onChange={(e) => setPerm({...perm, numberVariant: Number(e.target.value)})} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800" />
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-2">Capabilities</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-3 border rounded bg-white dark:bg-gray-800">
                  <input type="checkbox" checked={!!perm.syncro} onChange={(e) => setPerm({...perm, syncro: e.target.checked})} />
                  <div>
                    <div className="text-sm font-medium">Syncro</div>
                    <div className="text-xs text-gray-500">Enable synchronization features</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded bg-white dark:bg-gray-800">
                  <input type="checkbox" checked={!!perm.tracking} onChange={(e) => setPerm({...perm, tracking: e.target.checked})} />
                  <div>
                    <div className="text-sm font-medium">Tracking</div>
                    <div className="text-xs text-gray-500">Order and inventory tracking</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded bg-white dark:bg-gray-800">
                  <input type="checkbox" checked={!!perm.exchange} onChange={(e) => setPerm({...perm, exchange: e.target.checked})} />
                  <div>
                    <div className="text-sm font-medium">Exchange</div>
                    <div className="text-xs text-gray-500">Enable exchange/refund workflows</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600">Dashboard</label>
                <input value={perm.dashboard || ''} onChange={(e) => setPerm({...perm, dashboard: e.target.value})} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Last Updated</label>
                <div className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 text-sm">{formatDate(perm.updatedDatetime)}</div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PackPermissions;
