const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      };

      console.log(`API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // If not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        return { success: false, message: errorMessage };
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      return { success: true, data };
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          message: 'Unable to connect to server. Please check your internet connection.' 
        };
      }
      
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Convenience methods for common admin API calls
export const adminApi = {
  login: (email: string, password: string) => 
    apiClient.post<{ token: string; admin: any }>('/api/admin/login', { email, password }),
    
  createDisaster: (disasterData: any) => 
    apiClient.post('/api/admin/disasters', disasterData),
    
  updateResources: (disasterId: string, resources: any) => 
    apiClient.put('/api/admin/disasters/resources', { disasterId, resources }),
};
