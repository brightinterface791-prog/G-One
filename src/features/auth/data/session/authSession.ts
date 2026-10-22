import type { AuthUser } from '../../domain/models/AuthUser';

// Compatibility with existing sessions and the current App.tsx routing.
// Storage strategy can be upgraded independently without changing UI.
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const APP_USER_KEY = 'g_one_user';

export const authSession = {
  getToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(APP_USER_KEY) || localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) as AuthUser : null;
    } catch { return null; }
  },
  save(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  saveAppUser(user: AuthUser): void {
    localStorage.setItem(APP_USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(APP_USER_KEY);
  },
};
