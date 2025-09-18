import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, Modal, Loading } from '../components/ui';

const Packs = () => {
  const { state, actions } = useApp();
  const { packs, users } = state;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPack, setNewPack] = useState({ name: '', description: '', price: 0, period: 'month', features: [] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPack, setEditPack] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingDeletePack, setPendingDeletePack] = useState(null);

  useEffect(() => {
    // try to load packs from backend
    let mounted = true;
    async function load() {
      if (!actions.fetchPacks) return;
      setLoading(true);
      try {
        await actions.fetchPacks();
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleDeletePack = (packId) => {
    const pack = packs.find(p => p && p.id === packId) || null;
    setPendingDeletePack(pack);
  };

  const togglePopular = (packId) => {
    // persist popular state via savePack when available
    const pack = packs.find(p => p.id === packId);
    if (!pack) return;
    const updated = { ...pack, popular: !pack.popular };
    if (actions.savePack) {
      actions.savePack(packId, updated);
    } else {
      actions.togglePackPopular(packId);
    }
  };

  const handleCreatePack = async () => {
    setCreating(true);
    try {
      // ensure features is an array
      const payload = { ...newPack, features: Array.isArray(newPack.features) ? newPack.features : (typeof newPack.features === 'string' ? newPack.features.split(',').map(s => s.trim()).filter(Boolean) : []) };
      const created = await actions.createPack(payload);
      setShowCreateModal(false);
      setNewPack({ name: '', description: '', price: 0, period: 'month', features: [] });
    } catch (e) {
      // ignore for now
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (pack) => {
    setEditPack({ ...pack, features: Array.isArray(pack.features) ? pack.features : [] });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editPack) return;
    setEditing(true);
    try {
      const payload = { ...editPack, features: Array.isArray(editPack.features) ? editPack.features : (typeof editPack.features === 'string' ? editPack.features.split(',').map(s=>s.trim()).filter(Boolean) : []) };
      if (actions.savePack) {
        await actions.savePack(editPack.id, payload);
      } else {
        actions.updatePack(payload);
      }
      setShowEditModal(false);
      setEditPack(null);
    } catch (e) {
      // ignore
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Subscription Packs</h2>
            <p className="text-gray-600 mt-1">Manage your pricing plans and features</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            icon="fas fa-plus"
          >
            Create Pack
          </Button>
        </div>

        {/* Pack Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Total Packs</p>
                <p className="text-2xl font-bold text-blue-800">{packs.length}</p>
              </div>
              <i className="fas fa-box text-blue-500 text-2xl"></i>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Active Subscriptions</p>
                <p className="text-2xl font-bold text-green-800">{users.length}</p>
              </div>
              <i className="fas fa-users text-green-500 text-2xl"></i>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Avg. Revenue</p>
                <p className="text-2xl font-bold text-purple-800">
                  ${packs.length ? Math.round(packs.reduce((sum, pack) => sum + pack.price, 0) / packs.length) : 0}
                </p>
              </div>
              <i className="fas fa-chart-line text-purple-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </Card>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <Loading message="Loading packs…" />
          </div>
        ) : packs.length === 0 ? (
          <div className="col-span-full text-center py-12">No packs found.</div>
        ) : packs.map((pack) => {
          const subscribedUsers = users.filter(user => user.pack === pack.name).length;
          
          return (
            <Card 
              key={pack.id} 
              className={`relative ${pack.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
              hover
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pack.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">${pack.price}</span>
                  <span className="text-gray-600 ml-2">/ TND</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {(pack.features || []).slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="fas fa-check text-green-500"></i>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
                {Array.isArray(pack.features) && pack.features.length > 5 && (
                  <div className="text-gray-500 text-sm">
                    +{pack.features.length - 5} more features
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Button className="w-full" onClick={() => openEdit(pack)}>
                  Edit Pack
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant={pack.popular ? 'primary' : 'secondary'}
                    size="sm" 
                    className="flex-1"
                    onClick={() => togglePopular(pack.id)}
                  >
                    {pack.popular ? 'Remove Popular' : 'Mark Popular'}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeletePack(pack.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Active Users:</span>
                  <span className="font-medium">{subscribedUsers}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Monthly Revenue:</span>
                  <span className="font-medium text-green-600">${subscribedUsers * pack.price}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Pack Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Create New Pack"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={newPack.name} onChange={(e) => setNewPack({...newPack, name: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input value={newPack.description} onChange={(e) => setNewPack({...newPack, description: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" value={newPack.price} onChange={(e) => setNewPack({...newPack, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Period</label>
              <select value={newPack.period} onChange={(e) => setNewPack({...newPack, period: e.target.value})} className="w-full px-3 py-2 border rounded">
                <option value="month">month</option>
                <option value="year">year</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
            <input value={Array.isArray(newPack.features) ? newPack.features.join(', ') : (newPack.features || '')} onChange={(e) => setNewPack({...newPack, features: e.target.value})} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreatePack} disabled={creating}>{creating ? 'Creating…' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!pendingDeletePack}
        onClose={() => setPendingDeletePack(null)}
        title="Delete Pack"
        size="sm"
      >
        {pendingDeletePack ? (
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{pendingDeletePack.name}</strong>?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setPendingDeletePack(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => {
                const id = pendingDeletePack.id;
                setPendingDeletePack(null);
                if (actions.removePack) {
                  actions.removePack(id);
                } else {
                  actions.deletePack(id);
                }
              }}>Delete</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Edit Pack Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditPack(null); }}
        title="Edit Pack"
        size="lg"
      >
        {editPack ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input value={editPack.name} onChange={(e) => setEditPack({...editPack, name: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input value={editPack.description} onChange={(e) => setEditPack({...editPack, description: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" value={editPack.price} onChange={(e) => setEditPack({...editPack, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Period</label>
                <select value={editPack.period} onChange={(e) => setEditPack({...editPack, period: e.target.value})} className="w-full px-3 py-2 border rounded">
                  <option value="month">month</option>
                  <option value="year">year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
              <input value={Array.isArray(editPack.features) ? editPack.features.join(', ') : (editPack.features || '')} onChange={(e) => setEditPack({...editPack, features: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => { setShowEditModal(false); setEditPack(null); }}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={editing}>{editing ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        ) : (
          <div>Loading…</div>
        )}
      </Modal>
    </div>
  );
};

export default Packs;
