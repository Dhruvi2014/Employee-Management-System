import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for uniform error handling
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
  /**
   * Fetch all employees with optional search, department filter, and sorting
   */
  getAll({ search = '', department = '', sortBy = 'id', sortOrder = 'DESC' } = {}) {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (department && department !== 'All') params.department = department;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    return apiClient.get('/employees', { params });
  },

  /**
   * Fetch single employee by ID
   */
  getById(id) {
    return apiClient.get(`/employees/${id}`);
  },

  /**
   * Create a new employee
   */
  create(employeeData) {
    return apiClient.post('/employees', employeeData);
  },

  /**
   * Update existing employee
   */
  update(id, employeeData) {
    return apiClient.put(`/employees/${id}`, employeeData);
  },

  /**
   * Delete employee by ID
   */
  delete(id) {
    return apiClient.delete(`/employees/${id}`);
  },

  /**
   * Get employee dashboard statistics
   */
  getStats() {
    return apiClient.get('/employees/stats');
  },

  /**
   * Check backend health
   */
  checkHealth() {
    return apiClient.get('/health');
  },
};
