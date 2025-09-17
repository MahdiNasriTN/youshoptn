import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge } from '../components/ui';

const Analytics = () => {
  const { state } = useApp();
  const { analytics } = state;

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Revenue Growth</p>
              <p className="text-2xl font-bold">{analytics.revenueGrowth}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">User Growth</p>
              <p className="text-2xl font-bold">{analytics.userGrowth}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <i className="fas fa-users text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold">{analytics.conversionRate}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <i className="fas fa-percentage text-xl"></i>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Churn Reduction</p>
              <p className="text-2xl font-bold">{analytics.churnReduction}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <i className="fas fa-chart-pie text-xl"></i>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trends">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-chart-area text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500">Chart integration with libraries like Chart.js</p>
            </div>
          </div>
        </Card>

        <Card title="Top Performing Packs">
          <div className="space-y-4">
            {analytics.topPacks.map((pack, index) => (
              <div key={pack.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={index === 0 ? 'warning' : index === 1 ? 'default' : 'orange'}>
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-800">{pack.name}</p>
                    <p className="text-sm text-gray-500">{pack.users} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${pack.revenue}</p>
                  <p className="text-sm text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${
                activity.type === 'new_user' ? 'bg-green-100 text-green-600' :
                activity.type === 'upgrade' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                <i className={`fas ${
                  activity.type === 'new_user' ? 'fa-user-plus' :
                  activity.type === 'upgrade' ? 'fa-arrow-up' :
                  activity.type === 'payment' ? 'fa-credit-card' :
                  'fa-sync'
                }`}></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
