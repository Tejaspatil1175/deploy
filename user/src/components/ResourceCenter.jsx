import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  Heart,
  Droplets,
  Shirt,
  Home,
  Utensils,
  Battery,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { apiClient } from '../utils/api';

const ResourceCenter = ({ user, className = '' }) => {
  const [requests, setRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [requestForm, setRequestForm] = useState({
    category: '',
    item: '',
    quantity: 1,
    priority: 'medium',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const resourceCategories = {
    medical: {
      icon: Heart,
      label: 'Medical',
      color: 'from-red-500 to-red-600',
      items: ['First Aid Kit', 'Medicines', 'Bandages', 'Antiseptic', 'Pain Relievers', 'Insulin', 'Oxygen Tank']
    },
    food: {
      icon: Utensils,
      label: 'Food & Water',
      color: 'from-green-500 to-green-600',
      items: ['Drinking Water', 'Canned Food', 'Dry Rations', 'Baby Formula', 'Snacks', 'Fruits', 'Vegetables']
    },
    clothing: {
      icon: Shirt,
      label: 'Clothing',
      color: 'from-blue-500 to-blue-600',
      items: ['Blankets', 'Warm Clothes', 'Shoes', 'Raincoats', 'Undergarments', 'Baby Clothes', 'Towels']
    },
    shelter: {
      icon: Home,
      label: 'Shelter',
      color: 'from-orange-500 to-orange-600',
      items: ['Tents', 'Sleeping Bags', 'Pillows', 'Mattresses', 'Tarps', 'Ropes', 'Tools']
    },
    utilities: {
      icon: Battery,
      label: 'Utilities',
      color: 'from-purple-500 to-purple-600',
      items: ['Flashlights', 'Batteries', 'Portable Chargers', 'Radios', 'Candles', 'Matches', 'Generator']
    },
    water: {
      icon: Droplets,
      label: 'Water & Sanitation',
      color: 'from-cyan-500 to-cyan-600',
      items: ['Bottled Water', 'Water Purification Tablets', 'Soap', 'Sanitizer', 'Toilet Paper', 'Diapers', 'Wet Wipes']
    }
  };

  // Mock existing requests for demonstration
  React.useEffect(() => {
    setRequests([
      {
        id: 1,
        category: 'medical',
        item: 'First Aid Kit',
        quantity: 2,
        priority: 'high',
        status: 'pending',
        requestedAt: new Date(Date.now() - 30 * 60 * 1000),
        estimatedDelivery: '2-4 hours'
      },
      {
        id: 2,
        category: 'food',
        item: 'Drinking Water',
        quantity: 10,
        priority: 'high',
        status: 'approved',
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estimatedDelivery: '1-2 hours',
        volunteer: 'John D.'
      },
      {
        id: 3,
        category: 'clothing',
        item: 'Blankets',
        quantity: 3,
        priority: 'medium',
        status: 'delivered',
        requestedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        volunteer: 'Sarah M.'
      }
    ]);
  }, []);

  const submitRequest = async () => {
    if (!requestForm.category || !requestForm.item) return;

    setLoading(true);
    try {
      // In real app, send to API
      const newRequest = {
        id: Date.now(),
        ...requestForm,
        status: 'pending',
        requestedAt: new Date(),
        estimatedDelivery: '2-6 hours'
      };

      setRequests(prev => [newRequest, ...prev]);
      setShowRequestModal(false);
      setSelectedCategory('');
      setRequestForm({
        category: '',
        item: '',
        quantity: 1,
        priority: 'medium',
        description: '',
        location: ''
      });
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'delivered':
        return Package;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Emergency Resources
          </h3>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Request</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {requests.length === 0 ? (
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No resource requests</p>
            <p className="text-sm text-gray-400">Request emergency supplies when needed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const categoryConfig = resourceCategories[request.category];
              const CategoryIcon = categoryConfig?.icon || Package;
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${categoryConfig?.color || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800">{request.item}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Quantity: {request.quantity}</span>
                        <span>{request.requestedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {request.status === 'pending' && (
                        <p className="text-sm text-orange-600">
                          Estimated delivery: {request.estimatedDelivery}
                        </p>
                      )}

                      {request.status === 'approved' && (
                        <p className="text-sm text-blue-600">
                          Being prepared by {request.volunteer} • ETA: {request.estimatedDelivery}
                        </p>
                      )}

                      {request.status === 'delivered' && (
                        <p className="text-sm text-green-600">
                          Delivered by {request.volunteer} at {request.deliveredAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    <StatusIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowRequestModal(false);
              setSelectedCategory('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Request Resources</h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedCategory('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-96">
                {!selectedCategory ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 mb-4">Select a category:</p>
                    {Object.entries(resourceCategories).map(([key, category]) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedCategory(key);
                            setRequestForm(prev => ({ ...prev, category: key }));
                          }}
                          className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-800">{category.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to categories
                    </button>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Item *
                      </label>
                      <select
                        value={requestForm.item}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, item: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Choose an item...</option>
                        {resourceCategories[selectedCategory]?.items.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={requestForm.quantity}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority *
                      </label>
                      <select
                        value={requestForm.priority}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={requestForm.description}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional details about your request..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Location
                      </label>
                      <input
                        type="text"
                        value={requestForm.location}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Your current location or delivery address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedCategory('');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRequest}
                    disabled={!requestForm.item || loading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceCenter;
