import React, { useState, useEffect } from 'react';
import { 
  User, 
  Store, 
  Key, 
  Shield,
  Save,
  AlertCircle
} from 'lucide-react';
import { tenantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ButtonSpinner } from '../components/LoadingSpinner';
import { isValidEmail, isValidShopifyURL, formatDate } from '../utils/helpers';
import { mockSummaryData } from '../data/mockData';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [credentialsData, setCredentialsData] = useState({
    shopifyAccessToken: '',
    shopifyApiKey: ''
  });
  const [stats, setStats] = useState(null);
  const [errors, setErrors] = useState({});
  
  const { currentTenant, updateTenantData } = useAuth();

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      // Mock tenant data for demo
      const mockProfile = {
        name: currentTenant?.name || 'Demo Store',
        email: currentTenant?.email || 'demo@example.com'
      };
      
      const mockStats = {
        customers: mockSummaryData.totalCustomers,
        products: 156,
        orders: mockSummaryData.totalOrders,
        totalRevenue: mockSummaryData.totalRevenue
      };
      
      setProfileData(mockProfile);
      setStats(mockStats);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Failed to load tenant data:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate profile data
    const newErrors = {};
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResponse = {
        tenant: {
          ...currentTenant,
          name: profileData.name,
          email: profileData.email,
          updatedAt: new Date().toISOString()
        }
      };
      
      updateTenantData(mockResponse.tenant);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      if (error.details) {
        const backendErrors = {};
        error.details.forEach(detail => {
          backendErrors[detail.param] = detail.msg;
        });
        setErrors(backendErrors);
      } else {
        toast.error(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    
    // Validate credentials
    const newErrors = {};
    if (!credentialsData.shopifyAccessToken) {
      newErrors.shopifyAccessToken = 'Access token is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Shopify credentials updated successfully');
      setCredentialsData({
        shopifyAccessToken: '',
        shopifyApiKey: ''
      });
    } catch (error) {
      console.error('Credentials update failed:', error);
      if (error.details) {
        const backendErrors = {};
        error.details.forEach(detail => {
          backendErrors[detail.param] = detail.msg;
        });
        setErrors(backendErrors);
      } else {
        toast.error(error.message || 'Failed to update credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'store', name: 'Store Info', icon: Store },
    { id: 'credentials', name: 'API Credentials', icon: Key },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode - Settings
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This page shows demo settings. Profile and credentials updates are simulated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and store configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 mt-6 lg:mt-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <p className="text-sm text-gray-500">Update your account profile information</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="card-body space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className={`form-input ${errors.name ? 'border-red-300' : ''}`}
                    placeholder="Enter your store name"
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className={`form-input ${errors.email ? 'border-red-300' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <ButtonSpinner />
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span className="ml-2">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Store Info Tab */}
          {activeTab === 'store' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Store Information</h3>
                <p className="text-sm text-gray-500">Your Shopify store details</p>
              </div>
              <div className="card-body">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Store URL</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentTenant?.shopifyStoreUrl}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                        currentTenant?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {currentTenant?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(currentTenant?.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(currentTenant?.updatedAt)}
                    </dd>
                  </div>
                </dl>

                {stats && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Data Statistics</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Customers</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.customers || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Products</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.products || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Orders</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.orders || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Revenue</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">
                          ${(stats.totalRevenue || 0).toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Credentials Tab */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Shopify API Credentials</h3>
                  <p className="text-sm text-gray-500">Update your Shopify API access credentials</p>
                </div>
                <form onSubmit={handleCredentialsSubmit} className="card-body space-y-4">
                  <div className="alert alert-info">
                    <AlertCircle className="h-4 w-4" />
                    <span className="ml-2 text-sm">
                      Your current credentials are encrypted and secure. Only update if needed.
                    </span>
                  </div>

                  <div>
                    <label htmlFor="shopifyAccessToken" className="form-label">
                      Access Token
                    </label>
                    <input
                      type="password"
                      id="shopifyAccessToken"
                      value={credentialsData.shopifyAccessToken}
                      onChange={(e) => setCredentialsData(prev => ({ 
                        ...prev, 
                        shopifyAccessToken: e.target.value 
                      }))}
                      className={`form-input ${errors.shopifyAccessToken ? 'border-red-300' : ''}`}
                      placeholder="Enter new access token"
                    />
                    {errors.shopifyAccessToken && (
                      <p className="form-error">{errors.shopifyAccessToken}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shopifyApiKey" className="form-label">
                      API Key (Optional)
                    </label>
                    <input
                      type="text"
                      id="shopifyApiKey"
                      value={credentialsData.shopifyApiKey}
                      onChange={(e) => setCredentialsData(prev => ({ 
                        ...prev, 
                        shopifyApiKey: e.target.value 
                      }))}
                      className="form-input"
                      placeholder="Enter API key (optional)"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Only required for certain advanced features
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <ButtonSpinner />
                          <span className="ml-2">Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="ml-2">Update Credentials</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Getting Your Credentials</h3>
                </div>
                <div className="card-body">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p>To get your Shopify API credentials:</p>
                    <ol>
                      <li>Go to your Shopify admin panel</li>
                      <li>Navigate to <strong>Apps → Manage private apps</strong></li>
                      <li>Create a new private app or select an existing one</li>
                      <li>Copy the <strong>Admin API access token</strong></li>
                      <li>Ensure the app has the following permissions:
                        <ul>
                          <li>Read customers</li>
                          <li>Read orders</li>
                          <li>Read products</li>
                        </ul>
                      </li>
                    </ol>
                    <p>
                      <a 
                        href="https://help.shopify.com/en/manual/apps/private-apps" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Learn more about Shopify private apps →
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Account Security</h4>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-green-400" />
                        <div className="ml-3">
                          <p className="text-sm text-green-800">
                            Your account is secured with JWT authentication
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Data Protection</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All data is encrypted in transit and at rest</li>
                      <li>• Multi-tenant architecture ensures data isolation</li>
                      <li>• API credentials are encrypted and never logged</li>
                      <li>• Regular security audits and updates</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Security Recommendations</h4>
                        <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                          <li>• Regularly rotate your Shopify access tokens</li>
                          <li>• Monitor your account for unusual activity</li>
                          <li>• Use strong, unique passwords</li>
                          <li>• Keep your Shopify app permissions minimal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;