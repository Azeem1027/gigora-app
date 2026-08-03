// src/api.js
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'https://gigora-app-production-86ee.up.railway.app').replace(/\/$/, '');

// Ensures endpoint builds correctly as https://gigora-app-production-86ee.up.railway.app/api
const BASE_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

/**
 * Universal API Request Helper
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { body, headers = {}, userId, method = 'POST', ...customConfig } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'X-User-Id': userId } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...customConfig,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_URL}${cleanEndpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Error [${endpoint}]: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Fetch error at ${cleanEndpoint}:`, err);
    throw err;
  }
};

// Endpoint Specific Named Helpers
export const analyzeProfile = async (data, userId) => {
  return apiRequest('/profile-analyzer', { body: data, userId });
};

export const generateProposal = async (data, userId) => {
  return apiRequest('/proposal', { body: data, userId });
};

export const optimizeSeo = async (data, userId) => {
  return apiRequest('/seo', { body: data, userId });
};

export const deleteHistoryItem = async (id, userId) => {
  return apiRequest(`/history/${id}`, { method: 'DELETE', userId });
};