import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// Dynamically detect the machine's local IP address
const hostUri = Constants.expoConfig?.hostUri;
const machineIp = hostUri ? hostUri.split(':')[0] : 'localhost';

let API_URL = `http://${machineIp}:5000/api`;

if (Platform.OS === 'web') {
  API_URL = 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Bypass-Tunnel-Reminder': 'true' // Required for Localtunnel
  }
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
