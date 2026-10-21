import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const login = async (credentials: any) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  if (!response.data.data) {
    throw new Error('Invalid response from server: Data missing.');
  }
  
  const { token, hospital_name, ...userData } = response.data.data;
  const user = { name: hospital_name, hospitalName: hospital_name, ...userData };
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
