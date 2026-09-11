// Lightweight API client with automatic JWT token injection, query caching, and error handling

// Configurable base URL: In development or via proxy, default to '/api'.
// In production on Vercel, points to Render backend URL e.g. 'https://smartplacementportal.onrender.com/api'
const RAW_BASE = import.meta.env.VITE_API_URL || '/api';
const API_BASE = RAW_BASE.replace(/\/+$/, '');

// In-memory response cache (similar to React Query client cache)
const apiCache = new Map();
const DEFAULT_CACHE_TTL = 30000; // 30 seconds default cache TTL for queries

export const api = {
  // Invalidate cache by key prefix or clear all
  invalidateCache(pattern = '') {
    if (!pattern) {
      apiCache.clear();
      return;
    }
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  },

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('spp_token');
    const method = (options.method || 'GET').toUpperCase();

    // Cache check for GET requests (unless explicitly disabled)
    if (method === 'GET' && options.cache !== false) {
      const cached = apiCache.get(endpoint);
      const ttl = options.ttl || DEFAULT_CACHE_TTL;
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      // Cache GET responses
      if (method === 'GET' && options.cache !== false) {
        apiCache.set(endpoint, {
          data,
          timestamp: Date.now(),
        });
      }

      // Invalidate relevant cache on mutating actions
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        // Automatically invalidate related endpoints
        if (endpoint.startsWith('/jobs')) api.invalidateCache('/jobs');
        if (endpoint.startsWith('/applications')) api.invalidateCache('/applications');
        if (endpoint.startsWith('/questions')) api.invalidateCache('/questions');
        if (endpoint.startsWith('/resumes')) api.invalidateCache('/resumes');
        if (endpoint.startsWith('/interviews')) api.invalidateCache('/interviews');
        if (endpoint.startsWith('/admin')) api.invalidateCache('/admin');
        if (endpoint.startsWith('/notifications')) api.invalidateCache('/notifications');
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
