import axios from 'axios';
import { LoginData, RegisterData } from '@/types/auth';

const API_URL = '/api/auth';

/**
 * Logs in a user.
 * @param loginData - The user's login credentials.
 * @returns The response from the server.
 */
export const login = async (loginData: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data;
};

/**
 * Registers a new user.
 * @param registerData - The user's registration details.
 * @returns The response from the server.
 */
export const register = async (registerData: RegisterData) => {
  const response = await axios.post(`${API_URL}/register`, registerData);
  return response.data;
};

/**
 * Logs out the current user.
 * @returns The response from the server.
 */
export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  console.log(response.data, response.headers)
  return response.data;
};
