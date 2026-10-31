const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Handle API responses and uniform error extraction
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

export const employeeApi = {
  /**
   * Fetch all employees with optional search, department filter, and sort
   */
  async getAll({ search = '', department = '', sortBy = 'id', sortOrder = 'DESC' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (department && department !== 'All') params.append('department', department);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/employees${query}`);
    return handleResponse(res);
  },

  /**
   * Fetch a single employee by ID
   */
  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`);
    return handleResponse(res);
  },

  /**
   * Create a new employee
   */
  async create(employeeData) {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(res);
  },

  /**
   * Update existing employee
   */
  async update(id, employeeData) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(res);
  },

  /**
   * Delete an employee
   */
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Get employee dashboard statistics
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/employees/stats`);
    return handleResponse(res);
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },
};
