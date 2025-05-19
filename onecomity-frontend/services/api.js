import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.2.34:5000/api',
  timeout: 10000,
});

// Attach token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const sendOtp = (mobile) => API.post('/auth/send-otp', { mobile });
export const verifyOtp = (mobile, otp) => API.post('/auth/verify-otp', { mobile, otp });
export const getNearbyUsers = (activity, lat, lng) =>
  API.get('/user/nearby', {
    params: { activity, lat, lng },
  });
