import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SearchFilterBar from './components/SearchFilterBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import Toast from './components/Toast';
import { employeeApi } from './services/api';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');

  const [modalState, setModalState] = useState({
    isOpen: false,
    employee: null,
    loading: false,
    serverErrors: {},
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    employee: null,
    loading: false,
  });

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, title }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await employeeApi.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeeApi.getAll({
        search: searchQuery,
        department: departmentFilter,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setEmployees(res.data || []);
      }
    } catch (err) {
      console.error('Fetch employees error:', err);
      setError(err.message || 'Could not connect to employee database.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, departmentFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
    if (window.location.search.includes('modal=add')) {
      handleOpenAddModal();
    }
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const availableDepartments = useMemo(() => {
    const deptsFromStats = stats?.departmentStats?.map((d) => d.department) || [];
    const deptsFromEmployees = employees.map((e) => e.department);
    const combined = Array.from(new Set([...deptsFromStats, ...deptsFromEmployees]));
    return combined.sort();
  }, [stats, employees]);

  const handleOpenAddModal = () => {
    setModalState({
      isOpen: true,
      employee: null,
      loading: false,
      serverErrors: {},
    });
  };

  const handleOpenEditModal = (emp) => {
    setModalState({
      isOpen: true,
      employee: emp,
      loading: false,
      serverErrors: {},
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      serverErrors: {},
    }));
  };

  const handleModalSubmit = async (formData) => {
    setModalState((prev) => ({ ...prev, loading: true, serverErrors: {} }));

    try {
      if (modalState.employee) {
        const res = await employeeApi.update(modalState.employee.id, formData);
        if (res.success) {
          addToast('success', `Employee "${formData.name}" updated successfully!`, 'Updated');
          handleCloseModal();
          fetchEmployees();
          fetchStats();
        }
      } else {
        const res = await employeeApi.create(formData);
        if (res.success) {
          addToast('success', `Employee "${formData.name}" registered successfully!`, 'Created');
          handleCloseModal();
          fetchEmployees();
          fetchStats();
        }
      }
    } catch (err) {
      console.error('Save employee error:', err);
      if (err.errors && Object.keys(err.errors).length > 0) {
        setModalState((prev) => ({
          ...prev,
          loading: false,
          serverErrors: err.errors,
        }));
        addToast('error', err.message || 'Please correct the highlighted form errors.', 'Validation Error');
      } else {
        setModalState((prev) => ({ ...prev, loading: false }));
        addToast('error', err.message || 'Operation failed. Please try again.', 'Error');
      }
    }
  };

  const handleOpenDeleteModal = (emp) => {
    setDeleteModalState({
      isOpen: true,
      employee: emp,
      loading: false,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      employee: null,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const { employee } = deleteModalState;
    if (!employee) return;

    setDeleteModalState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await employeeApi.delete(employee.id);
      if (res.success) {
        addToast('success', `Employee "${employee.name}" removed from the system.`, 'Deleted');
        handleCloseDeleteModal();
        fetchEmployees();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete employee error:', err);
      setDeleteModalState((prev) => ({ ...prev, loading: false }));
      addToast('error', err.message || 'Failed to delete employee.', 'Delete Error');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('All');
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="app-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <Navbar onAddClick={handleOpenAddModal} totalCount={employees.length} />

      <main className="main-content">
        <StatsCards stats={stats} employeeCount={employees.length} />

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          departments={availableDepartments}
          onRefresh={() => {
            fetchEmployees();
            fetchStats();
          }}
          loading={loading}
          totalResults={employees.length}
        />

        <EmployeeTable
          employees={employees}
          loading={loading}
          error={error}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onClearFilters={handleClearFilters}
          onRetry={() => {
            fetchEmployees();
            fetchStats();
          }}
        />
      </main>

      <EmployeeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        employee={modalState.employee}
        loading={modalState.loading}
        serverErrors={modalState.serverErrors}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        employee={deleteModalState.employee}
        loading={deleteModalState.loading}
      />

      <footer className="app-footer">
        <p>
          Employee Management System &bull; React.js + Node.js Express + PostgreSQL &bull; Fully Validated REST APIs
        </p>
      </footer>
    </div>
  );
}
