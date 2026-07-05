// In dev, Vite proxies /api to localhost:4000 (see vite.config.js).
// In production (e.g. deployed on Render), set VITE_API_URL to your backend's
// full URL, e.g. https://aperture-api.onrender.com/api
const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('aperture_token');
}

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),

  feed: () => request('/photos/feed'),
  explore: (verifiedOnly) => request(`/photos/explore${verifiedOnly ? '?verified=true' : ''}`),
  trending: () => request('/photos/trending'),
  photo: (id) => request(`/photos/${id}`),
  deletePhoto: (id) => request(`/photos/${id}`, { method: 'DELETE' }),
  like: (id) => request(`/photos/${id}/like`, { method: 'POST' }),
  dislike: (id) => request(`/photos/${id}/dislike`, { method: 'POST' }),
  report: (id, reason) => request(`/photos/${id}/report`, { method: 'POST', body: { reason } }),
  upload: (formData) => request('/photos', { method: 'POST', body: formData, isForm: true }),

  profile: (username) => request(`/users/${username}`),
  updateMe: (payload) => request('/users/me', { method: 'PATCH', body: payload }),
};

export function setToken(token) {
  if (token) localStorage.setItem('aperture_token', token);
  else localStorage.removeItem('aperture_token');
}

export function hasToken() {
  return Boolean(getToken());
}
