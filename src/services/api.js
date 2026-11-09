// API Service for GrowSmart Dashboard
import { getToken, isAuthFailure, notifySessionExpired } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/dashboard';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // If the server rejected our token, end the session (AuthContext shows the
  // login screen) and throw. Other 401/403 responses are left to the caller.
  async handleAuthError(response) {
    let message = '';
    try {
      const body = await response.clone().json();
      message = body?.message || '';
    } catch {
      // Body is not JSON
    }
    if (isAuthFailure(response.status, message)) {
      notifySessionExpired();
      const err = new Error('Session expired. Please login again.');
      err.status = response.status;
      err.isAuthError = true;
      throw err;
    }
  }

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { skipAuthHandling = false, headers = {}, ...rest } = options;
    const config = {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers,
      },
    };

    try {
       console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
       const response = await fetch(url, config);
       
       if (!response.ok) {
         let errorData = null;
         try {
           errorData = await response.json();
         } catch (e) {
           // Response body is not JSON
         }
         
         // Token rejected: end the session (skipped for the login call itself,
         // where 401 just means a wrong password)
         if (!skipAuthHandling && isAuthFailure(response.status, errorData?.message)) {
           notifySessionExpired();
           const err = new Error('Session expired. Please login again.');
           err.status = response.status;
           err.isAuthError = true;
           throw err;
         }
         
         // Handle 403 Forbidden - extract message and onHoldMessage
         if (response.status === 403 && errorData) {
           const errorMessage = errorData.onHoldMessage
             ? `${errorData.message || 'Account on hold'}: ${errorData.onHoldMessage}`
             : (errorData.message || `Access denied. HTTP error! status: ${response.status}`);
           const err = new Error(errorMessage);
           err.status = response.status;
           throw err;
         }
         
         const err = new Error(errorData?.message || `HTTP error! status: ${response.status}`);
         err.status = response.status;
         throw err;
       }

       const data = await response.json();
       console.log(`✅ API Response: ${endpoint}`, data);
       return data;
     } catch (error) {
       console.error(`❌ API Error: ${endpoint}`, error);
       throw error;
     }
  }

  // Get all users (teachers and students)
  async getAllUsers() {
    return this.request('/api/admin/dashboard-data');
  }

  // Get teachers by status

  // Get dashboard overview
  async getDashboardOverview() {
    return this.request('/api/admin/dashboard-data');
  }

  // gogrowsmart.com visitor counts: total/unique visitors and people live right now
  async getSiteAnalytics() {
    return this.request('/api/admin/site-analytics');
  }

  // Get students and teachers with their state for analytics charts (server-cached; refresh bypasses the cache)
  async getUserAnalytics({ refresh = false } = {}) {
    return this.request(`/api/admin/user-analytics${refresh ? '?refresh=1' : ''}`);
  }

  // Admin login
  async adminLogin(email, password) {
    return this.request('/api/admin/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuthHandling: true
    });
  }

  // Verify admin token
  async verifyToken() {
    return this.request('/api/admin/verify');
  }

  // Notification methods
  async getAdminNotifications() {
    return this.request('/api/admin/notifications');
  }

  async getAdminUnreadCount() {
    return this.request('/api/admin/notifications/unread-count');
  }

  async markNotificationAsRead(notificationId) {
    return this.request('/api/admin/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ notification_id: notificationId })
    });
  }

  async sendNotification(data) {
    return this.request('/api/admin/send-notification', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Get all subjects with teacher details
  async getAllSubjects() {
    const token = getToken();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/all-subjects`;
    
    try {
      console.log(`🌐 API Request: GET ${url}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: /api/admin/all-subjects`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: /api/admin/all-subjects`, error);
      throw error;
    }
  }

  // Get all published subjects from subjects table
  async getPublishedSubjects() {
    const token = getToken();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/published-subjects`;
    
    try {
      console.log(`🌐 API Request: GET ${url}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: /api/admin/published-subjects`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: /api/admin/published-subjects`, error);
      throw error;
    }
  }

   // Update subject status (accept/reject)
  async updateSubjectStatus(subjectId, status) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/update-subject-status`;

    try {
      console.log(`🌐 API Request: POST ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({ subject_id: subjectId, status }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: /api/admin/update-subject-status`, data);
      return data;
    } catch (error) {
      console.error('❌ API Error: /api/admin/update-subject-status', error);
      throw error;
    }
  }

  // Delete tutor certificate

  // Delete a user from the database
  async deleteUser(id) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Block or unblock a user (toggle status between inactive/active)
  async blockUser(id) {
    return this.request(`/api/admin/users/${id}/block`, {
      method: 'PATCH',
    });
  }

  // ==================== Advertisement Management ====================

  // Get all ads for admin management
  async getAllAds() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/ads/all`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API Error: /api/admin/ads/all', error);
      throw error;
    }
  }

  // Create a new advertisement (multipart form data for image upload)
  async createAd(formData) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/ads`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API Error: POST /api/admin/ads', error);
      throw error;
    }
  }

  // Update an existing advertisement
  async updateAd(id, formData) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/ads/${id}`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API Error: PUT /api/admin/ads/:id', error);
      throw error;
    }
  }

  // Delete an advertisement
  async deleteAd(id) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/admin/ads/${id}`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API Error: DELETE /api/admin/ads/:id', error);
      throw error;
    }
  }

  // ==================== Spotlight Purchases ====================

  // Get all spotlight purchase data (admin only)
  async getSpotlightPurchases() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/billing/spotlight-purchases`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          await this.handleAuthError(response);
        }
        if (response.status === 403) {
          throw new Error('Access denied. Admin role required.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response: GET /api/billing/spotlight-purchases', data);
      return data;
    } catch (error) {
      console.error('❌ API Error: GET /api/billing/spotlight-purchases', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
