// Mock data for the admin panel

export const dashboardStats = {
  todayOrders: { count: 247, change: 12.5 },
  revenue: { amount: 45678, change: 8.3 },
  activeSubscriptions: { count: 1432, cancelled: 23 },
  newUsers: { count: 89, change: 15.2 },
  pendingDeliveries: { count: 45 },
  paymentFailures: { count: 8, change: -20 },
};

export const revenueData = [
  { name: 'Mon', revenue: 4000, subscriptions: 2400 },
  { name: 'Tue', revenue: 3000, subscriptions: 1398 },
  { name: 'Wed', revenue: 2000, subscriptions: 9800 },
  { name: 'Thu', revenue: 2780, subscriptions: 3908 },
  { name: 'Fri', revenue: 1890, subscriptions: 4800 },
  { name: 'Sat', revenue: 2390, subscriptions: 3800 },
  { name: 'Sun', revenue: 3490, subscriptions: 4300 },
];

export const topProducts = [
  { id: 1, name: 'Fresh Milk 1L', sales: 1234, revenue: 24680 },
  { id: 2, name: 'Organic Eggs (12 pcs)', sales: 987, revenue: 19740 },
  { id: 3, name: 'Greek Yogurt 500g', sales: 856, revenue: 17120 },
  { id: 4, name: 'Cheese Block 200g', sales: 654, revenue: 13080 },
  { id: 5, name: 'Butter 250g', sales: 543, revenue: 10860 },
];

export const users = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+880 1712-345678',
    status: 'active',
    location: 'Dhaka, Bangladesh',
    loyaltyPoints: 1250,
    totalOrders: 45,
    subscriptionStatus: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fatima Rahman',
    email: 'fatima@example.com',
    phone: '+880 1812-345679',
    status: 'active',
    location: 'Chittagong, Bangladesh',
    loyaltyPoints: 890,
    totalOrders: 32,
    subscriptionStatus: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Karim Ahmed',
    email: 'karim@example.com',
    phone: '+880 1912-345680',
    status: 'inactive',
    location: 'Sylhet, Bangladesh',
    loyaltyPoints: 450,
    totalOrders: 18,
    subscriptionStatus: 'paused',
    joinDate: '2024-03-10',
  },
];

export const orders = [
  {
    id: 'ORD-001',
    customerName: 'Ahmed Hassan',
    customerPhone: '+880 1712-345678',
    items: 'Fresh Milk 1L x2, Organic Eggs x1',
    total: 350,
    status: 'pending',
    paymentMethod: 'cash',
    orderDate: '2025-10-23T08:30:00',
    deliveryAgent: null,
  },
  {
    id: 'ORD-002',
    customerName: 'Fatima Rahman',
    customerPhone: '+880 1812-345679',
    items: 'Greek Yogurt x3, Butter x1',
    total: 580,
    status: 'processing',
    paymentMethod: 'online',
    orderDate: '2025-10-23T09:15:00',
    deliveryAgent: 'Rahim Khan',
  },
  {
    id: 'ORD-003',
    customerName: 'Karim Ahmed',
    customerPhone: '+880 1912-345680',
    items: 'Cheese Block x2',
    total: 400,
    status: 'delivered',
    paymentMethod: 'online',
    orderDate: '2025-10-22T14:20:00',
    deliveryAgent: 'Salim Uddin',
  },
];

export const subscriptionPackages = [
  {
    id: 'PKG-001',
    name: 'Daily Fresh Package',
    products: ['Fresh Milk 1L', 'Organic Eggs (6 pcs)'],
    price: 450,
    frequency: 'daily',
    subscribers: 234,
    status: 'active',
  },
  {
    id: 'PKG-002',
    name: 'Weekly Family Package',
    products: ['Fresh Milk 2L', 'Organic Eggs (12 pcs)', 'Greek Yogurt 500g', 'Cheese Block 200g'],
    price: 1200,
    frequency: 'weekly',
    subscribers: 156,
    status: 'active',
  },
  {
    id: 'PKG-003',
    name: 'Premium Health Package',
    products: ['Organic Milk 1L', 'Free-range Eggs (12 pcs)', 'Greek Yogurt 1kg', 'Organic Cheese 300g'],
    price: 1800,
    frequency: 'weekly',
    subscribers: 89,
    status: 'active',
  },
];
