import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


const { API_URL, SOCKET_URL } = Constants.expoConfig.extra;

const API = axios.create({
  baseURL: API_URL, // <-- set to your backend IP
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

// ---- AUTH ----
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const sendOtp = (mobile) => API.post('/auth/send-otp', { mobile });
export const verifyOtp = (mobile, otp) => API.post('/auth/verify-otp', { mobile, otp });

// ---- USER ----
export const getNearbyUsers = (activity, lat, lng) =>
  API.get('/user/nearby', {
    params: { activity, lat, lng },
  });
export const updateActivity = (activity) =>
  API.patch('/user/activity', { activity });



// ---- CHAT ----
export const getChatMessages = (userId) => API.get(`/chats/${userId}`); // plural: 'chats'
export const sendChatMessage = (receiverId, text) => API.post('/chats/send', { receiverId, text });
export const getChatList = () => API.get('/chats');
export const hideChat = (partnerId) => API.delete(`/chats/${partnerId}/hide`);
export const hardDeleteChat = (partnerId) =>
  API.delete(`/chats/${partnerId}/hard`);



// If you want to use the default axios instance for custom requests
export default API;
