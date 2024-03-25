import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,  // CORS 요청에 쿠키/인증 헤더 포함
});

export default apiClient;