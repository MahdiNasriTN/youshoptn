import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, Modal } from '../components/ui';

const Packs = () => {
  const { state, actions } = useApp();
  const { packs, users } = state;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeletePack = (packId) => {
    if (window.confirm('Are you sure you want to delete this pack?')) {
      actions.deletePack(packId);
    }
  };

  const togglePopular = (packId) => {
    actions.togglePackPopular(packId);
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
                  ${Math.round(packs.reduce((sum, pack) => sum + pack.price, 0) / packs.length)}
                </p>
              </div>
              <i className="fas fa-chart-line text-purple-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </Card>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packs.map((pack) => {
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
                  <span className="text-gray-600 ml-2">/{pack.period}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {pack.features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="fas fa-check text-green-500"></i>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
                {pack.features.length > 5 && (
                  <div className="text-gray-500 text-sm">
                    +{pack.features.length - 5} more features
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Button className="w-full">
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
        <div className="text-center py-12">
          <i className="fas fa-box text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Pack Creation Form</h3>
          <p className="text-gray-500">Full pack creation form will be implemented here.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Packs;
