import axios from 'axios';

// Backend এর address
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// প্রতিটা request এ automatically token যোগ করছি
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;