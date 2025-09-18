// Test function to simulate disaster alert
export const testDisasterAlert = () => {
  // Create a test disaster alert
  const testDisaster = {
    _id: 'test-alert',
    type: 'Test Alert',
    description: 'This is a test disaster alert to verify audio functionality',
    radius: 1,
    location: {
      type: 'Point',
      coordinates: [0, 0] // Test coordinates
    }
  };

  // Trigger browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚨 Test Disaster Alert', {
      body: 'This is a test alert to verify audio functionality',
      icon: '/favicon.ico',
      tag: 'test-alert'
    });
  }

  // Log test alert
  console.log('🚨 TEST DISASTER ALERT TRIGGERED');
  console.log('Test disaster:', testDisaster);
  
  return testDisaster;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission === 'granted';
  }
  return false;
};

