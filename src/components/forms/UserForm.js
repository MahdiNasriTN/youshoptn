import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Input, Select } from '../ui';

const UserForm = ({ user, onSave, onCancel }) => {
  const { state } = useApp();
  const { packs } = state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    pack: 'Basic',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      revenue: packs.find(p => p.name === formData.pack)?.price || 99,
      avatar: user?.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=100&h=100&fit=crop&crop=face`
    };
    onSave(userData);
  };

  const packOptions = packs.map(pack => ({
    value: pack.name,
    label: `${pack.name} - $${pack.price}/month`
  }));

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Expired', label: 'Expired' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <Input
        label="Company"
        value={formData.company}
        onChange={(e) => setFormData({...formData, company: e.target.value})}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Subscription Pack"
          value={formData.pack}
          onChange={(e) => setFormData({...formData, pack: e.target.value})}
          options={packOptions}
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          options={statusOptions}
        />
      </div>

      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <Button type="submit" className="flex-1">
          {user ? 'Update User' : 'Create User'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
