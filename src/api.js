// Klien API tipis untuk admin hub.
const BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8787').replace(/\/$/, '');

const TOKEN_KEY = 'srikandi_admin_token';

export const token = {
  get: () => sessionStorage.getItem(TOKEN_KEY) || '',
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

// Dipanggil api.js saat dapat 401 — App memasang handler untuk paksa logout.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token.get() ? { Authorization: `Bearer ${token.get()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Tidak bisa terhubung ke server API.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token.get()) onUnauthorized();
    throw new ApiError(data.error || `Gagal (${res.status})`, res.status, data.details);
  }
  return data;
}

export const api = {
  base: BASE,
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b),
  put: (p, b) => request('PUT', p, b),
  patch: (p, b) => request('PATCH', p, b),
  del: (p) => request('DELETE', p),
};
