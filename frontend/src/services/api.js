import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Analysis API
export const analyzeContent = async (inputData) => {
  try {
    const formData = new FormData();
    
    if (inputData.type === 'text') {
      formData.append('text', inputData.content);
      formData.append('analysis_type', 'text');
    } else if (inputData.type === 'image') {
      formData.append('image', inputData.file);
      formData.append('analysis_type', 'image');
    } else if (inputData.type === 'url') {
      formData.append('url', inputData.content);
      formData.append('analysis_type', 'url');
    }

  const response = await api.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(error.response?.data?.detail || 'Analysis failed');
  }
};

// Archive API
export const getArchivedReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.filterRisk) params.append('risk_level', filters.filterRisk);
    if (filters.filterDate) params.append('date_range', filters.filterDate);
    
  const response = await api.get(`/api/archive?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Archive error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to load archived reports');
  }
};

// Dashboard API
export const getDashboardData = async (timeRange = '7d') => {
  try {
  const response = await api.get(`/api/archive/stats?time_range=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Dashboard error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to load dashboard data');
  }
};

// Report API
export const submitReport = async (reportData) => {
  try {
    const response = await api.post('/api/report', reportData);
    return response.data;
  } catch (error) {
    console.error('Report error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to submit report');
  }
};

// Get individual report details
export const getReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/api/archive/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Get report details error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to load report details');
  }
};

// Export report as PDF or JSON
export const exportReport = async (reportId, format = 'json') => {
  try {
    const response = await api.get(`/api/archive/${reportId}/export?format=${format}`, {
      responseType: format === 'pdf' ? 'blob' : 'json'
    });
    return response;
  } catch (error) {
    console.error('Export report error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to export report');
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error('API is not available');
  }
};

// Mock data for development



export default api;
