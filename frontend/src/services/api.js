import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message || 'API request failed'
    );
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors || {};
    return Promise.reject(customError);
  }
);

export const employeeApi = {
  getAll({ search = '', department = '', sortBy = 'id', sortOrder = 'DESC' } = {}) {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (department && department !== 'All') params.department = department;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    return apiClient.get('/employees', { params });
  },

  getById(id) {
    return apiClient.get(`/employees/${id}`);
  },

  create(employeeData) {
    return apiClient.post('/employees', employeeData);
  },

  update(id, employeeData) {
    return apiClient.put(`/employees/${id}`, employeeData);
  },

  delete(id) {
    return apiClient.delete(`/employees/${id}`);
  },

  getStats() {
    return apiClient.get('/employees/stats');
  },

  checkHealth() {
    return apiClient.get('/health');
  },
};
