import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentTenant');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }
    
    if (response?.status === 403) {
      toast.error('Access denied. You don\'t have permission for this action.');
      return Promise.reject(error);
    }
    
    if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentTenant', JSON.stringify(response.data.tenant));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentTenant', JSON.stringify(response.data.tenant));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentTenant');
    window.location.href = '/login';
  }
};

// Tenant API
export const tenantAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/tenant/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/tenant/profile', data);
      // Update cached tenant data
      localStorage.setItem('currentTenant', JSON.stringify(response.data.tenant));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateShopifyCredentials: async (data) => {
    try {
      const response = await api.put('/tenant/shopify-credentials', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/tenant/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Data Ingestion API
export const ingestionAPI = {
  syncCustomers: async (fullSync = false) => {
    try {
      const response = await api.post(`/ingestion/customers?full_sync=${fullSync}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  syncProducts: async (fullSync = false) => {
    try {
      const response = await api.post(`/ingestion/products?full_sync=${fullSync}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  syncOrders: async (fullSync = false, status = 'any') => {
    try {
      const response = await api.post(`/ingestion/orders?full_sync=${fullSync}&status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  fullSync: async () => {
    try {
      const response = await api.post('/ingestion/full-sync');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStatus: async () => {
    try {
      const response = await api.get('/ingestion/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Insights API
export const insightsAPI = {
  getSummary: async () => {
    try {
      const response = await api.get('/insights/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrdersByDate: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.groupBy) queryParams.append('group_by', params.groupBy);
      
      const response = await api.get(`/insights/orders-by-date?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTopCustomers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.period) queryParams.append('period', params.period);
      
      const response = await api.get(`/insights/top-customers?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductPerformance: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sort_by', params.sortBy);
      if (params.period) queryParams.append('period', params.period);
      
      const response = await api.get(`/insights/product-performance?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRevenueTrends: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.groupBy) queryParams.append('group_by', params.groupBy);
      
      const response = await api.get(`/insights/revenue-trends?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomerAcquisition: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.groupBy) queryParams.append('group_by', params.groupBy);
      if (params.period) queryParams.append('period', params.period);
      
      const response = await api.get(`/insights/customer-acquisition?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;