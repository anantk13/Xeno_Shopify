import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Users, 
  Package, 
  ShoppingCart, 
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import { ingestionAPI } from '../services/api';
import LoadingSpinner, { ButtonSpinner } from '../components/LoadingSpinner';
import { formatNumber, formatDate } from '../utils/helpers';
import { mockSummaryData } from '../data/mockData';
import toast from 'react-hot-toast';

const IngestionPage = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState({});
  const [status, setStatus] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);

  useEffect(() => {
    loadIngestionStatus();
  }, []);

  const loadIngestionStatus = async () => {
    try {
      setLoading(true);
      
      // Mock ingestion status data for demo
      const mockStatus = {
        customers: {
          count: mockSummaryData.totalCustomers,
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        products: {
          count: 156, // Based on mock products data
          lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        },
        orders: {
          count: mockSummaryData.totalOrders,
          lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        }
      };
      
      // Mock sync history
      const mockHistory = [
        {
          id: 1,
          type: 'orders',
          fullSync: false,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          results: { created: 23, updated: 45 },
          status: 'success'
        },
        {
          id: 2,
          type: 'customers',
          fullSync: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          results: { created: 8, updated: 12 },
          status: 'success'
        },
        {
          id: 3,
          type: 'products',
          fullSync: true,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          results: { created: 156, updated: 0 },
          status: 'success'
        },
        {
          id: 4,
          type: 'full',
          fullSync: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          results: { created: 1247, updated: 2645 },
          status: 'success'
        },
        {
          id: 5,
          type: 'orders',
          fullSync: false,
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
          error: 'Shopify API rate limit exceeded',
          status: 'failed'
        }
      ];
      
      setStatus(mockStatus);
      setSyncHistory(mockHistory);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Failed to load ingestion status:', error);
      toast.error('Failed to load data status');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (type, fullSync = false) => {
    setSyncing(prev => ({ ...prev, [type]: true }));
    
    try {
      // Simulate sync operation with mock results
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const mockResults = {
        customers: { created: Math.floor(Math.random() * 10) + 1, updated: Math.floor(Math.random() * 20) + 5 },
        products: { created: Math.floor(Math.random() * 5), updated: Math.floor(Math.random() * 15) + 3 },
        orders: { created: Math.floor(Math.random() * 25) + 10, updated: Math.floor(Math.random() * 30) + 15 },
        full: { created: Math.floor(Math.random() * 50) + 20, updated: Math.floor(Math.random() * 100) + 50 }
      };
      
      toast.success(`${type} sync completed successfully`);
      
      // Add to sync history
      setSyncHistory(prev => [
        {
          id: Date.now(),
          type,
          fullSync,
          timestamp: new Date(),
          results: mockResults[type] || mockResults.full,
          status: 'success'
        },
        ...prev.slice(0, 9) // Keep last 10 entries
      ]);
      
      // Update status counts
      if (type === 'customers' || type === 'full') {
        setStatus(prev => ({
          ...prev,
          customers: {
            ...prev.customers,
            count: prev.customers.count + (mockResults[type]?.created || 0),
            lastSync: new Date().toISOString()
          }
        }));
      }
      
      if (type === 'products' || type === 'full') {
        setStatus(prev => ({
          ...prev,
          products: {
            ...prev.products,
            count: prev.products.count + (mockResults[type]?.created || 0),
            lastSync: new Date().toISOString()
          }
        }));
      }
      
      if (type === 'orders' || type === 'full') {
        setStatus(prev => ({
          ...prev,
          orders: {
            ...prev.orders,
            count: prev.orders.count + (mockResults[type]?.created || 0),
            lastSync: new Date().toISOString()
          }
        }));
      }
      
    } catch (error) {
      console.error(`${type} sync failed:`, error);
      toast.error(`${type} sync failed: ${error.message}`);
      
      // Add failed sync to history
      setSyncHistory(prev => [
        {
          id: Date.now(),
          type,
          fullSync,
          timestamp: new Date(),
          error: error.message,
          status: 'failed'
        },
        ...prev.slice(0, 9)
      ]);
    } finally {
      setSyncing(prev => ({ ...prev, [type]: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading ingestion status..." />;
  }

  const syncCards = [
    {
      type: 'customers',
      title: 'Customers',
      description: 'Sync customer data from Shopify',
      icon: Users,
      color: 'blue',
      count: status?.customers?.count || 0,
      lastSync: status?.customers?.lastSync
    },
    {
      type: 'products',
      title: 'Products',
      description: 'Sync product catalog from Shopify',
      icon: Package,
      color: 'green',
      count: status?.products?.count || 0,
      lastSync: status?.products?.lastSync
    },
    {
      type: 'orders',
      title: 'Orders',
      description: 'Sync order data from Shopify',
      icon: ShoppingCart,
      color: 'purple',
      count: status?.orders?.count || 0,
      lastSync: status?.orders?.lastSync
    }
  ];

  const getStatusIcon = (syncStatus) => {
    switch (syncStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode - Data Ingestion
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This page simulates Shopify data synchronization. In production, this would sync real data from your Shopify store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Ingestion</h1>
          <p className="text-gray-600">Sync data from your Shopify store</p>
        </div>
        <button
          onClick={() => handleSync('full')}
          disabled={syncing.full}
          className="mt-4 sm:mt-0 btn btn-primary"
        >
          {syncing.full ? (
            <>
              <ButtonSpinner />
              <span className="ml-2">Full Sync Running...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span className="ml-2">Full Sync</span>
            </>
          )}
        </button>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {syncCards.map((card) => {
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600'
          };

          return (
            <div key={card.type} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-md ${colorClasses[card.color]}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{formatNumber(card.count)}</div>
                    <div className="text-sm text-gray-500">Records</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                
                {card.lastSync && (
                  <p className="text-xs text-gray-500 mb-3">
                    Last sync: {formatDate(card.lastSync)}
                  </p>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSync(card.type, false)}
                    disabled={syncing[card.type]}
                    className="flex-1 btn btn-secondary text-xs py-1"
                  >
                    {syncing[card.type] ? (
                      <>
                        <ButtonSpinner />
                        <span className="ml-1">Syncing...</span>
                      </>
                    ) : (
                      'Quick Sync'
                    )}
                  </button>
                  <button
                    onClick={() => handleSync(card.type, true)}
                    disabled={syncing[card.type]}
                    className="flex-1 btn btn-primary text-xs py-1"
                  >
                    {syncing[card.type] ? (
                      <>
                        <ButtonSpinner />
                        <span className="ml-1">Syncing...</span>
                      </>
                    ) : (
                      'Full Sync'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync History */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Sync History</h3>
          <p className="text-sm text-gray-500">Recent data synchronization activities</p>
        </div>
        <div className="card-body">
          {syncHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sync history available</p>
          ) : (
            <div className="space-y-3">
              {syncHistory.map((sync) => (
                <div
                  key={sync.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(sync.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {sync.type} {sync.fullSync ? '(Full)' : '(Quick)'} Sync
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(sync.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {sync.status === 'success' && sync.results ? (
                      <div className="text-xs text-gray-600">
                        <div>Created: {sync.results.created || 0}</div>
                        <div>Updated: {sync.results.updated || 0}</div>
                      </div>
                    ) : sync.status === 'failed' ? (
                      <div className="text-xs text-red-600">
                        {sync.error}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Sync Instructions</h3>
        </div>
        <div className="card-body">
          <div className="prose prose-sm max-w-none text-gray-600">
            <h4 className="text-gray-900">How to sync your Shopify data:</h4>
            <ul>
              <li><strong>Quick Sync:</strong> Syncs the latest 250 records from Shopify. Use this for regular updates.</li>
              <li><strong>Full Sync:</strong> Syncs all available data from your Shopify store. Use this for initial setup or when you need complete data.</li>
              <li><strong>Full Sync (All):</strong> Syncs customers, products, and orders in one operation. This may take several minutes for large stores.</li>
            </ul>
            
            <h4 className="text-gray-900 mt-4">Important Notes:</h4>
            <ul>
              <li>Shopify has API rate limits. Large stores may need to sync in smaller batches.</li>
              <li>Full syncs can take several minutes depending on your store size.</li>
              <li>Data is automatically deduplicated based on Shopify IDs.</li>
              <li>Real-time sync via webhooks can be configured for automatic updates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestionPage;