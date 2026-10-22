import type { AuthRepository } from '../domain/repositories/AuthRepository';
import type { LoginCredentials, AuthUser } from '../domain/models/AuthUser';

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  login(credentials: LoginCredentials): Promise<AuthUser> {
    return this.repository.login(credentials);
  }

  logout(): void {
    this.repository.logout();
  }
}
