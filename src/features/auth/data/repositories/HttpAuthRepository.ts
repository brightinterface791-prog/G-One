import apiClient from '../../../../api/apiClient';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthUser, LoginCredentials } from '../../domain/models/AuthUser';
import { authSession } from '../session/authSession';

type LoginPayload = {
  data?: {
    token?: string;
    access_token?: string;
    hospital_name?: string;
    name?: string;
    role?: string;
    [key: string]: unknown;
  };
};

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await apiClient.post<LoginPayload>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const payload = response.data?.data;
    if (!payload) throw new Error('Invalid response from server: Data missing.');
    const { token, access_token, hospital_name, ...rest } = payload;
    const accessToken = token || access_token;
    if (!accessToken) throw new Error('Invalid response from server: Token missing.');
    const user: AuthUser = {
      name: String(hospital_name || payload.name || ''),
      hospitalName: String(hospital_name || payload.name || ''),
      ...rest,
    };
    authSession.save(accessToken, user);
    return user;
  }

  logout(): void {
    authSession.clear();
  }
}
