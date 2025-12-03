// Mock data for dashboard demo

export const mockSummaryData = {
  totalCustomers: 1247,
  totalOrders: 3892,
  totalRevenue: 187459.50,
  averageOrderValue: 48.15,
  growth: {
    customers: 12.5,
    orders: 18.2,
    revenue: 15.7,
    avgOrderValue: -2.3
  }
};

export const mockTopCustomers = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    periodSpend: 1245.80,
    periodOrderCount: 12,
    avgOrderValue: 103.82,
    totalSpent: 2547.60,
    ordersCount: 24
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@example.com',
    periodSpend: 987.50,
    periodOrderCount: 8,
    avgOrderValue: 123.44,
    totalSpent: 1876.25,
    ordersCount: 15
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    periodSpend: 756.20,
    periodOrderCount: 15,
    avgOrderValue: 50.41,
    totalSpent: 1654.80,
    ordersCount: 33
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    periodSpend: 652.90,
    periodOrderCount: 6,
    avgOrderValue: 108.82,
    totalSpent: 1305.80,
    ordersCount: 12
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@example.com',
    periodSpend: 543.75,
    periodOrderCount: 9,
    avgOrderValue: 60.42,
    totalSpent: 987.45,
    ordersCount: 18
  }
];

export const mockTopProducts = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    handle: 'premium-wireless-headphones',
    vendor: 'TechGear',
    productType: 'Electronics',
    price: 199.99,
    soldQuantity: 156,
    revenue: 31198.44,
    inventoryQuantity: 45
  },
  {
    id: '2',
    title: 'Organic Cotton T-Shirt',
    handle: 'organic-cotton-tshirt',
    vendor: 'EcoWear',
    productType: 'Clothing',
    price: 29.99,
    soldQuantity: 243,
    revenue: 7287.57,
    inventoryQuantity: 123
  },
  {
    id: '3',
    title: 'Smart Fitness Tracker',
    handle: 'smart-fitness-tracker',
    vendor: 'FitTech',
    productType: 'Electronics',
    price: 89.99,
    soldQuantity: 98,
    revenue: 8819.02,
    inventoryQuantity: 67
  },
  {
    id: '4',
    title: 'Artisan Coffee Beans (1lb)',
    handle: 'artisan-coffee-beans',
    vendor: 'Bean Roasters Co.',
    productType: 'Food & Beverage',
    price: 24.99,
    soldQuantity: 189,
    revenue: 4723.11,
    inventoryQuantity: 234
  },
  {
    id: '5',
    title: 'Bamboo Yoga Mat',
    handle: 'bamboo-yoga-mat',
    vendor: 'ZenLife',
    productType: 'Sports & Recreation',
    price: 79.99,
    soldQuantity: 87,
    revenue: 6959.13,
    inventoryQuantity: 34
  }
];

export const generateMockOrdersData = (dateRange) => {
  const data = [];
  const endDate = new Date();
  let days = 30;
  
  switch (dateRange) {
    case 'last7Days':
      days = 7;
      break;
    case 'last30Days':
      days = 30;
      break;
    case 'last90Days':
      days = 90;
      break;
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    
    // Generate realistic data patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Weekend typically has less orders but higher AOV
    const baseOrders = isWeekend ? 
      Math.floor(Math.random() * 15) + 8 : 
      Math.floor(Math.random() * 25) + 12;
    
    const avgOrderValue = isWeekend ? 
      Math.random() * 30 + 55 : 
      Math.random() * 25 + 40;
    
    const orderCount = baseOrders + Math.floor(Math.random() * 8);
    const totalRevenue = Math.round(orderCount * avgOrderValue * 100) / 100;
    const customerCount = Math.floor(orderCount * (0.6 + Math.random() * 0.3));
    
    data.push({
      date: date.toISOString().split('T')[0],
      orderCount,
      totalRevenue,
      customerCount,
      avgOrderValue: Math.round((totalRevenue / orderCount) * 100) / 100
    });
  }
  
  return data;
};

export const mockRecentOrders = [
  {
    id: 'ORD-001',
    orderNumber: '#1001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@example.com',
    totalPrice: 156.78,
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'fulfilled',
    financialStatus: 'paid',
    itemCount: 3
  },
  {
    id: 'ORD-002',
    orderNumber: '#1002',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@example.com',
    totalPrice: 89.99,
    orderDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'pending',
    financialStatus: 'paid',
    itemCount: 1
  },
  {
    id: 'ORD-003',
    orderNumber: '#1003',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    totalPrice: 234.56,
    orderDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'fulfilled',
    financialStatus: 'paid',
    itemCount: 5
  },
  {
    id: 'ORD-004',
    orderNumber: '#1004',
    customerName: 'David Wilson',
    customerEmail: 'david.wilson@example.com',
    totalPrice: 67.43,
    orderDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'fulfilled',
    financialStatus: 'paid',
    itemCount: 2
  },
  {
    id: 'ORD-005',
    orderNumber: '#1005',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@example.com',
    totalPrice: 123.89,
    orderDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    status: 'pending',
    financialStatus: 'pending',
    itemCount: 3
  }
];

export const mockInsightsData = {
  customerAcquisition: {
    newCustomers: 87,
    returningCustomers: 156,
    conversionRate: 3.4,
    averageTimeToSecondOrder: 18.5 // days
  },
  salesChannels: [
    { name: 'Online Store', value: 65, revenue: 121447.75 },
    { name: 'Social Media', value: 20, revenue: 37491.90 },
    { name: 'Email Marketing', value: 10, revenue: 18745.95 },
    { name: 'Direct Traffic', value: 5, revenue: 9372.98 }
  ],
  topCategories: [
    { name: 'Electronics', orderCount: 156, revenue: 45623.12 },
    { name: 'Clothing', orderCount: 243, revenue: 32145.78 },
    { name: 'Home & Garden', orderCount: 98, revenue: 28934.56 },
    { name: 'Sports & Recreation', orderCount: 134, revenue: 25467.89 },
    { name: 'Food & Beverage', orderCount: 189, revenue: 15234.67 }
  ]
};

// Generate time-series data for different metrics
export const generateTimeSeriesData = (metric, days = 30) => {
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    let value;
    const trend = Math.sin(i / 7) * 0.3 + Math.random() * 0.4 - 0.2;
    
    switch (metric) {
      case 'revenue':
        value = 1500 + (trend * 500) + Math.random() * 300;
        break;
      case 'orders':
        value = 25 + (trend * 10) + Math.random() * 8;
        break;
      case 'customers':
        value = 18 + (trend * 7) + Math.random() * 5;
        break;
      case 'conversion':
        value = 3.2 + (trend * 0.8) + Math.random() * 0.4;
        break;
      default:
        value = 100 + (trend * 20) + Math.random() * 15;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return data;
};