export const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    company: "Tech Solutions Ltd",
    pack: "Enterprise",
    status: "Active",
    joinDate: "2024-01-15",
    revenue: 299,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@startup.com",
    company: "Startup Inc",
    pack: "Professional",
    status: "Active",
    joinDate: "2024-02-20",
    revenue: 199,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@smallbiz.com",
    company: "Small Business Co",
    pack: "Basic",
    status: "Pending",
    joinDate: "2024-03-10",
    revenue: 99,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily@enterprise.com",
    company: "Enterprise Corp",
    pack: "Enterprise",
    status: "Active",
    joinDate: "2024-01-05",
    revenue: 299,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@freelance.com",
    company: "Freelancer",
    pack: "Professional",
    status: "Expired",
    joinDate: "2023-12-01",
    revenue: 199,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  }
];

export const mockPacks = [
  {
    id: 1,
    name: "Basic",
    price: 99,
    currency: "USD",
    period: "month",
    description: "Perfect for small businesses starting their e-commerce journey",
    features: [
      "Up to 100 products",
      "Basic analytics",
      "Email support",
      "SSL certificate",
      "Mobile responsive design"
    ],
    permissions: ["view_products", "manage_orders", "basic_reports"],
    color: "bg-blue-500",
    popular: false
  },
  {
    id: 2,
    name: "Professional",
    price: 199,
    currency: "USD",
    period: "month",
    description: "Advanced features for growing businesses",
    features: [
      "Up to 1000 products",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "SEO optimization",
      "Social media integration",
      "Abandoned cart recovery"
    ],
    permissions: ["view_products", "manage_orders", "basic_reports", "advanced_analytics", "seo_tools", "social_integration"],
    color: "bg-purple-500",
    popular: true
  },
  {
    id: 3,
    name: "Enterprise",
    price: 299,
    currency: "USD",
    period: "month",
    description: "Complete solution for large enterprises",
    features: [
      "Unlimited products",
      "Full analytics suite",
      "24/7 phone support",
      "Custom integrations",
      "White-label solution",
      "Advanced security",
      "Multi-store management",
      "API access",
      "Custom workflows"
    ],
    permissions: ["all_permissions"],
    color: "bg-gradient-to-r from-orange-400 to-pink-500",
    popular: false
  }
];

export const mockPermissions = [
  { id: "view_products", name: "View Products", description: "Can view product listings" },
  { id: "manage_products", name: "Manage Products", description: "Can add, edit, and delete products" },
  { id: "manage_orders", name: "Manage Orders", description: "Can view and process orders" },
  { id: "basic_reports", name: "Basic Reports", description: "Access to basic sales reports" },
  { id: "advanced_analytics", name: "Advanced Analytics", description: "Access to detailed analytics and insights" },
  { id: "user_management", name: "User Management", description: "Can manage customer accounts" },
  { id: "seo_tools", name: "SEO Tools", description: "Access to SEO optimization tools" },
  { id: "social_integration", name: "Social Integration", description: "Can integrate with social media platforms" },
  { id: "api_access", name: "API Access", description: "Can use REST API for integrations" },
  { id: "white_label", name: "White Label", description: "Can customize branding and appearance" },
  { id: "multi_store", name: "Multi-Store", description: "Can manage multiple stores" },
  { id: "custom_workflows", name: "Custom Workflows", description: "Can create custom business workflows" },
  { id: "all_permissions", name: "All Permissions", description: "Full access to all features" }
];

export const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 1098,
  monthlyRevenue: 87350,
  churnRate: 3.2
};

export const mockAnalytics = {
  revenueGrowth: '+23.5%',
  userGrowth: '+12.8%',
  conversionRate: '3.2%',
  churnReduction: '-1.5%',
  topPacks: [
    { name: 'Professional', users: 45, revenue: 8955 },
    { name: 'Enterprise', users: 32, revenue: 9568 },
    { name: 'Basic', users: 78, revenue: 7722 }
  ],
  recentActivity: [
    { type: 'new_user', message: 'New user John Doe subscribed to Professional pack', time: '2 hours ago' },
    { type: 'upgrade', message: 'Sarah Johnson upgraded to Enterprise pack', time: '4 hours ago' },
    { type: 'payment', message: 'Payment received from Tech Solutions Ltd', time: '6 hours ago' },
    { type: 'renewal', message: 'Enterprise Corp renewed subscription', time: '1 day ago' },
  ]
};
