import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Global DDoS data
export const getGlobalDDoS = (period = '7d') =>
    API.get(`/global/ddos`, { params: { period } });

// IP Analysis
export const analyzeIP = (ip) =>
    API.get(`/analyze-ip/${ip}`);

// History
export const getHistory = (limit = 10, page = 1) =>
    API.get(`/analyze-ip/history`, { params: { limit, page } });

// Health check
export const healthCheck = () =>
    API.get('/health');

export default API;
