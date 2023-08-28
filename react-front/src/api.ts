import axios from 'axios';

const API_URL_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL_BASE,
});

export default api;
