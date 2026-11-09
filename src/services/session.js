// Stores the admin session in localStorage so it survives page refreshes.

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

// Fired when the server rejects our token; AuthContext listens and logs out.
export const SESSION_EXPIRED_EVENT = 'admin-session-expired';

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getToken = () => safeGet(TOKEN_KEY);

export const getStoredUser = () => {
  const raw = safeGet(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage blocked (e.g. private mode); session will last until refresh.
  }
};

export const updateStoredUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
};

// Reads the expiry time from the JWT without verifying it (the server does that).
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    // Not a readable JWT; let the server decide.
    return false;
  }
};

// Restores a saved session on startup, or returns null if there isn't a usable one.
export const loadSession = () => {
  const token = getToken();
  const user = getStoredUser();
  if (!token || !user || isTokenExpired(token)) {
    if (token || user) clearSession();
    return null;
  }
  return { token, user };
};

// Messages the backend's verifyToken middleware sends for a bad or expired token.
const AUTH_FAILURE_MESSAGES = [
  'no token provided',
  'token expired',
  'invalid token format',
  'token not active',
  'failed to authenticate token',
  'invalid token',
  'unauthorized',
];

// True only when the server says the token itself is no good.
// A 403 can also mean "not allowed to do this one thing", so check the message.
export const isAuthFailure = (status, message = '') => {
  if (status === 401) return true;
  if (status === 403) {
    const text = String(message).toLowerCase();
    return AUTH_FAILURE_MESSAGES.some((m) => text.includes(m));
  }
  return false;
};

export const notifySessionExpired = () => {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
