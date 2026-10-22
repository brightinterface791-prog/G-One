import type { AuthUser, LoginCredentials } from '../models/AuthUser';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  logout(): void;
}
