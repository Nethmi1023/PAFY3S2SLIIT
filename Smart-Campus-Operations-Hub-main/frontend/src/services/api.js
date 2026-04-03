import axios from 'axios';

// Base configuration for API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_STORAGE_KEY = 'auth_profile';

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add credentials if stored in localStorage
    const authProfileRaw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authProfileRaw) {
      const profile = JSON.parse(authProfileRaw);
      const username = profile?.username;
      const password = profile?.password;

      if (username && password) {
        config.auth = {
          username,
          password,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const clearAuthProfile = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const saveAuthProfile = (profile) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
};

const getAuthProfile = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_e) {
    clearAuthProfile();
    return null;
  }
};

// Add response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthProfile();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Resource API Service
 * Contains all API calls for resource management
 */
export const resourceAPI = {
  /**
   * Get all resources with pagination
   */
  getAllResources: (page = 0, size = 10, sort = 'id,desc') => {
    return apiClient.get('/resources', {
      params: { page, size, sort },
    });
  },

  /**
   * Get single resource by ID
   */
  getResourceById: (id) => {
    return apiClient.get(`/resources/${id}`);
  },

  /**
   * Create new resource
   */
  createResource: (resourceData) => {
    return apiClient.post('/resources', resourceData);
  },

  /**
   * Update existing resource
   */
  updateResource: (id, resourceData) => {
    return apiClient.put(`/resources/${id}`, resourceData);
  },

  /**
   * Delete resource
   */
  deleteResource: (id) => {
    return apiClient.delete(`/resources/${id}`);
  },

  /**
   * Search resources by keyword
   */
  searchResources: (keyword, page = 0, size = 10) => {
    return apiClient.get('/resources/search/keyword', {
      params: { keyword, page, size },
    });
  },

  /**
   * Filter resources by type
   */
  filterByType: (type, page = 0, size = 10) => {
    return apiClient.get('/resources/filter/type', {
      params: { type, page, size },
    });
  },

  /**
   * Filter resources by status
   */
  filterByStatus: (status, page = 0, size = 10) => {
    return apiClient.get('/resources/filter/status', {
      params: { status, page, size },
    });
  },

  /**
   * Filter resources by location
   */
  filterByLocation: (location, page = 0, size = 10) => {
    return apiClient.get('/resources/filter/location', {
      params: { location, page, size },
    });
  },

  /**
   * Filter resources by capacity
   */
  filterByCapacity: (capacity, page = 0, size = 10) => {
    return apiClient.get('/resources/filter/capacity', {
      params: { capacity, page, size },
    });
  },

  /**
   * Filter resources by type and capacity
   */
  filterByTypeAndCapacity: (type, capacity, page = 0, size = 10) => {
    return apiClient.get('/resources/filter/type-capacity', {
      params: { type, capacity, page, size },
    });
  },

  /**
   * Get available resources
   */
  getAvailableResources: () => {
    return apiClient.get('/resources/available/list');
  },
};

/**
 * Authentication service
 */
export const authAPI = {
  /**
   * Register new user account (USER role)
   */
  register: (username, password) => {
    return apiClient.post('/auth/register', { username, password });
  },

  /**
   * Login using Basic auth and store profile
   */
  login: async (username, password) => {
    const response = await apiClient.get('/auth/me', {
      auth: { username, password },
      headers: {
        'X-Auth-Check': 'login',
      },
    });

    const roles = response.data?.roles || [];
    saveAuthProfile({ username, password, roles });

    return response.data;
  },

  /**
   * Clear credentials
   */
  logout: () => {
    clearAuthProfile();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const profile = getAuthProfile();
    return !!(profile?.username && profile?.password);
  },

  getProfile: () => getAuthProfile(),

  hasRole: (role) => {
    const profile = getAuthProfile();
    return !!profile?.roles?.includes(role);
  },

  isAdmin: () => {
    return authAPI.hasRole('ADMIN');
  },
};

/**
 * Booking API Service
 */
export const bookingAPI = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/my'),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id) => apiClient.put(`/bookings/${id}/cancel`),
  // Admin
  getAllBookings: () => apiClient.get('/bookings'),
  confirmBooking: (id) => apiClient.put(`/bookings/${id}/confirm`),
  getBookingsByResource: (resourceId) => apiClient.get(`/bookings/resource/${resourceId}`),
};

export default apiClient;
