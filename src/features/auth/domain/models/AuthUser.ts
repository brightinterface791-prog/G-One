export interface AuthUser {
  name: string;
  role?: string;
  hospitalName?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
