import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input, Select, Badge, Modal, Table } from '../components/ui';
import UserForm from '../components/forms/UserForm';

const Users = () => {
  const { state, actions } = useApp();
  const { users, packs } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPack, setFilterPack] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPack = filterPack === 'all' || user.pack === filterPack;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      
      return matchesSearch && matchesPack && matchesStatus;
    });
  }, [users, searchTerm, filterPack, filterStatus]);

  const handleAddUser = (userData) => {
    actions.addUser(userData);
    setShowAddModal(false);
  };

  const handleEditUser = (userData) => {
    actions.updateUser({ ...userData, id: selectedUser.id });
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      actions.deleteUser(userId);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const packOptions = [
    { value: 'all', label: 'All Packs' },
    ...packs.map(pack => ({ value: pack.name, label: pack.name }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Expired', label: 'Expired' }
  ];

  // Table columns for table view
  const tableColumns = [
    {
      key: 'user',
      title: 'User',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <div>
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      title: 'Company',
      render: (company) => <span className="text-gray-700">{company}</span>
    },
    {
      key: 'pack',
      title: 'Pack',
      render: (pack) => (
        <Badge variant={pack === 'Enterprise' ? 'orange' : pack === 'Professional' ? 'purple' : 'primary'}>
          {pack}
        </Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => (
        <Badge variant={status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'danger'}>
          {status}
        </Badge>
      )
    },
    {
      key: 'revenue',
      title: 'Revenue',
      render: (revenue) => <span className="font-bold text-green-600">${revenue}/mo</span>
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      render: (joinDate) => <span className="text-gray-700">{new Date(joinDate).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(user)}
            icon="fas fa-edit"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteUser(user.id)}
            icon="fas fa-trash"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <Input
            icon="fas fa-search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="flex-1 max-w-md"
          />
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select
              value={filterPack}
              onChange={(e) => setFilterPack(e.target.value)}
              options={packOptions}
            />
            
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
            />

            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                icon="fas fa-th-large"
              />
              <Button
                variant={viewMode === 'table' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('table')}
                icon="fas fa-table"
              />
              
              <Button
                onClick={() => setShowAddModal(true)}
                icon="fas fa-plus"
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.company}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Pack:</span>
                  <Badge variant={user.pack === 'Enterprise' ? 'orange' : user.pack === 'Professional' ? 'purple' : 'primary'}>
                    {user.pack}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'danger'}>
                    {user.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Revenue:</span>
                  <span className="font-bold text-green-600">${user.revenue}/mo</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Join Date:</span>
                  <span className="text-gray-800 text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditModal(user)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDeleteUser(user.id)}
                  icon="fas fa-trash"
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table columns={tableColumns} data={filteredUsers} />
        </Card>
      )}

      {filteredUsers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <i className="fas fa-users text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add a new user.</p>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Add New User"
      >
        <UserForm 
          onSave={handleAddUser}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit User"
      >
        <UserForm 
          user={selectedUser}
          onSave={handleEditUser}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Users;
