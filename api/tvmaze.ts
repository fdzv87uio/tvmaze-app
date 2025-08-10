// api/tvmaze.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.tvmaze.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;