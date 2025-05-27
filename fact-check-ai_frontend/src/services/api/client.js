import axios from 'axios';
import API_URL from '../../constants'

// Axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});