// Lightweight API client with automatic JWT token injection, query caching, and error handling

// Configurable base URL: In development or via proxy, default to '/api'.
// In production on Vercel, points to Render backend URL e.g. 'https://smartplacementportal.onrender.com/api'
function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }
  return envUrl.trim().replace(/\/+$/, '');
}

const API_BASE = getBaseUrl();

export function buildUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If API_BASE is relative '/api' (local dev proxy)
  if (API_BASE === '/api') {
    return cleanEndpoint.startsWith('/api/') ? cleanEndpoint : `/api${cleanEndpoint}`;
  }

  // If API_BASE already ends with /api (e.g. 'https://xxx.onrender.com/api')
  if (API_BASE.endsWith('/api')) {
    const withoutApi = cleanEndpoint.startsWith('/api/') ? cleanEndpoint.slice(4) : cleanEndpoint;
    return `${API_BASE}${withoutApi}`;
  }

  // If API_BASE is just origin (e.g. 'https://xxx.onrender.com')
  const withoutApi = cleanEndpoint.startsWith('/api/') ? cleanEndpoint.slice(4) : cleanEndpoint;
  return `${API_BASE}/api${withoutApi}`;
}

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

    const targetUrl = buildUrl(endpoint);

    try {
      const response = await fetch(targetUrl, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (
          response.status === 404 &&
          API_BASE === '/api' &&
          typeof window !== 'undefined' &&
          window.location.hostname !== 'localhost' &&
          window.location.hostname !== '127.0.0.1'
        ) {
          throw new Error(
            'Backend API connection missing. In Vercel Project Settings > Environment Variables, add VITE_API_URL set to your Render backend URL (e.g. https://your-app.onrender.com) and click Redeploy.'
          );
        }
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
      console.error(`[API Error] ${targetUrl}:`, error.message);
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
