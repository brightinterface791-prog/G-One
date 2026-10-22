import { AuthService } from './application/AuthService';
import { HttpAuthRepository } from './data/repositories/HttpAuthRepository';

export const authService = new AuthService(new HttpAuthRepository());
export { authSession } from './data/session/authSession';
export type { AuthUser, LoginCredentials } from './domain/models/AuthUser';
