import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/ui';

const Dashboard = () => {
  const { state, actions } = useApp();
  const { stats, users, packs } = state;

  const StatCard = ({ title, value, change, icon, gradient }) => (
    <Card className={`text-white ${gradient} hover:scale-105 transition-transform`} padding="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-white/80 text-sm mt-2">{change}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <i className={`${icon} text-2xl`}></i>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12% from last month"
          icon="fas fa-users"
          gradient="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          change="+8% from last month"
          icon="fas fa-chart-line"
          gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change="+15% from last month"
          icon="fas fa-dollar-sign"
          gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatCard
          title="Churn Rate"
          value={`${stats.churnRate}%`}
          change="-2% from last month"
          icon="fas fa-chart-pie"
          gradient="bg-gradient-to-r from-orange-500 to-yellow-500"
        />
      </div>

      {/* Recent Users and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card
          title="Recent Users"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => actions.setCurrentView('users')}
            >
              View All
            </Button>
          }
        >
          <div className="space-y-4">
            {users.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.company}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      user.status === 'Active' ? 'success' :
                      user.status === 'Pending' ? 'warning' : 'danger'
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start text-left group"
              onClick={() => actions.setCurrentView('users')}
            >
              <i className="fas fa-user-plus text-blue-600 text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
              <div>
                <p className="font-medium text-gray-800">Add New User</p>
                <p className="text-sm text-gray-500 mt-1">Create customer account</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start text-left group"
              onClick={() => actions.setCurrentView('packs')}
            >
              <i className="fas fa-box text-purple-600 text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
              <div>
                <p className="font-medium text-gray-800">Create Pack</p>
                <p className="text-sm text-gray-500 mt-1">New subscription plan</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start text-left group"
              onClick={() => actions.setCurrentView('analytics')}
            >
              <i className="fas fa-chart-line text-green-600 text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
              <div>
                <p className="font-medium text-gray-800">View Analytics</p>
                <p className="text-sm text-gray-500 mt-1">Performance insights</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start text-left group"
              onClick={() => actions.setCurrentView('permissions')}
            >
              <i className="fas fa-shield-alt text-orange-600 text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
              <div>
                <p className="font-medium text-gray-800">Manage Permissions</p>
                <p className="text-sm text-gray-500 mt-1">Access control</p>
              </div>
            </Button>
          </div>
        </Card>
      </div>

      {/* Pack Distribution */}
      <Card title="Pack Distribution">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map((pack) => {
            const packUsers = users.filter(user => user.pack === pack.name).length;
            const percentage = ((packUsers / users.length) * 100).toFixed(1);
            
            return (
              <div key={pack.id} className="text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold ${pack.color}`}>
                  {packUsers}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{pack.name}</h4>
                <p className="text-sm text-gray-500">{percentage}% of users</p>
                <p className="text-lg font-bold text-gray-800 mt-2">${pack.price}/month</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
