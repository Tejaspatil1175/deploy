import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Edit3,
  Phone,
  MapPin,
  Mail,
  Shield,
  Bell,
  Users,
  Camera,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { apiClient } from '../utils/api';

const ProfileManager = ({ user, onUpdate, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    emergencyContacts: user?.emergencyContacts || [
      { name: '', phone: '', relationship: '' }
    ],
    preferences: {
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      smsNotifications: user?.preferences?.smsNotifications ?? true,
      pushNotifications: user?.preferences?.pushNotifications ?? true,
      locationTracking: user?.preferences?.locationTracking ?? true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, would call API
      // const updatedUser = await apiClient.put('/user/profile', profileData);
      
      if (onUpdate) {
        onUpdate({ ...user, ...profileData });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmergencyContact = () => {
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const updateEmergencyContact = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const togglePreference = (key) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Address
          </label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  const ContactsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">Emergency Contacts</h4>
        {isEditing && (
          <button
            onClick={addEmergencyContact}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {profileData.emergencyContacts.map((contact, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Contact {index + 1}</span>
              {isEditing && profileData.emergencyContacts.length > 1 && (
                <button
                  onClick={() => removeEmergencyContact(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                disabled={!isEditing}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={contact.phone}
                onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                disabled={!isEditing}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={contact.relationship}
                onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                disabled={!isEditing}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-800">Notification Preferences</h4>
      
      <div className="space-y-4">
        {Object.entries(profileData.preferences).map(([key, value]) => {
          const labels = {
            emailNotifications: 'Email Notifications',
            smsNotifications: 'SMS Notifications',
            pushNotifications: 'Push Notifications',
            locationTracking: 'Location Tracking'
          };
          
          const descriptions = {
            emailNotifications: 'Receive disaster alerts via email',
            smsNotifications: 'Get emergency SMS messages',
            pushNotifications: 'Browser push notifications',
            locationTracking: 'Share location for better assistance'
          };

          return (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-800">{labels[key]}</h5>
                <p className="text-sm text-gray-600">{descriptions[key]}</p>
              </div>
              <button
                onClick={() => isEditing && togglePreference(key)}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-800">Privacy Settings</h4>
      
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-medium text-yellow-800 mb-2">Data Usage</h5>
          <p className="text-sm text-yellow-700">
            Your location data is used only for emergency response and disaster management purposes.
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Account Security</h5>
          <p className="text-sm text-blue-700 mb-3">
            Keep your account secure with strong authentication.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            Change Password
          </button>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h5 className="font-medium text-red-800 mb-2">Danger Zone</h5>
          <p className="text-sm text-red-700 mb-3">
            Permanently delete your account and all associated data.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Management
          </h3>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <nav className="flex space-x-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileManager;