import axios from 'axios';
import { apiConfig } from '../shared/api/config';
import { authSession } from '../features/auth/data/session/authSession';

// One shared HTTP client; no automatic retries on writes (booking/payment safety).
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = authSession.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
