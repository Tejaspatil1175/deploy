import { API_BASE } from './constants.js';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data, success: true };
    } catch (error) {
      console.error('API Request failed:', error);
      return { error: error.message, success: false };
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/api/auth/me');
  }

  async logout() {
    const result = await this.request('/api/auth/logout');
    this.setToken(null);
    return result;
  }

  // User methods
  async updateLocation(email, location) {
    return this.request('/api/users/location', {
      method: 'POST',
      body: JSON.stringify({ email, location }),
    });
  }

  async trackLocation(email, location) {
    return this.request('/api/users/track', {
      method: 'POST',
      body: JSON.stringify({ email, location }),
    });
  }

  async updateStatus(email, status) {
    return this.request('/api/users/status', {
      method: 'POST',
      body: JSON.stringify({ email, status }),
    });
  }

  async getNearbyUsers(disasterId) {
    return this.request(`/api/users/nearby/${disasterId}`);
  }

  // Disaster methods
  async getDisasters() {
    return this.request('/api/disasters');
  }

  async getDisasterById(id) {
    return this.request(`/api/disasters/${id}`);
  }

  async createDisaster(disasterData) {
    return this.request('/api/disasters', {
      method: 'POST',
      body: JSON.stringify(disasterData),
    });
  }

  // Volunteer methods
  async registerVolunteer(volunteerData) {
    return this.request('/api/volunteers/register', {
      method: 'POST',
      body: JSON.stringify(volunteerData),
    });
  }

  // Alert methods
  async sendAlert(alertData) {
    return this.request('/api/alerts/send', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  // Route methods
  async getRoute(from, to) {
    return this.request(`/api/route?from=${from}&to=${to}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
