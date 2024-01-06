// api.js
import axios from "axios";
export const api = axios.create({
  headers: {
    "Content-type": "application/json",
    'Authorization': "Token "+ localStorage.getItem('authToken')
  }
});

api.interceptors.request.use(
  (config) => {
    // Modify the request config here
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Token ${authToken}`;
    }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

export default class ApiService{
  static saveStripeInfo(data={}){
    return api.post(`/api/django/payment/confirm`, data)
  }
}