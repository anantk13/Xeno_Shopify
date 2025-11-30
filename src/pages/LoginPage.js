import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ButtonSpinner } from '../components/LoadingSpinner';
import { isValidEmail, isValidShopifyURL } from '../utils/helpers';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    shopifyStoreUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.shopifyStoreUrl) {
      newErrors.shopifyStoreUrl = 'Shopify store URL is required';
    } else if (!isValidShopifyURL(formData.shopifyStoreUrl)) {
      newErrors.shopifyStoreUrl = 'Please enter a valid Shopify store URL (e.g., https://yourstore.myshopify.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    
    if (!result.success) {
      if (result.error?.details) {
        // Handle validation errors from backend
        const backendErrors = {};
        result.error.details.forEach(detail => {
          backendErrors[detail.param] = detail.msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: result.error?.message || 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="alert alert-error">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${errors.email ? 'border-red-300' : ''}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="shopifyStoreUrl" className="form-label">
                Shopify Store URL
              </label>
              <input
                id="shopifyStoreUrl"
                name="shopifyStoreUrl"
                type="url"
                autoComplete="url"
                required
                className={`form-input ${errors.shopifyStoreUrl ? 'border-red-300' : ''}`}
                placeholder="https://yourstore.myshopify.com"
                value={formData.shopifyStoreUrl}
                onChange={handleInputChange}
              />
              {errors.shopifyStoreUrl && (
                <p className="form-error">{errors.shopifyStoreUrl}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the URL of your Shopify development store
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <ButtonSpinner />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have a Shopify store?{' '}
              <a
                href="https://www.shopify.com/partners/shopify-for-developers"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Create a development store
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;