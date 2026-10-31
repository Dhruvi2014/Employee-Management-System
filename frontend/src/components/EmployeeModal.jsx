import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Design',
  'Marketing',
  'Finance',
  'Product',
  'Quality Assurance',
  'Sales',
  'Operations',
  'Legal',
];

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  loading = false,
  serverErrors = {},
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);

  const isEditMode = Boolean(employee);

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          mobile: employee.mobile || '',
          department: employee.department || '',
          designation: employee.designation || '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          mobile: '',
          department: '',
          designation: '',
        });
      }
      setErrors({});
      setTouched({});

      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, employee]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  const validateField = (field, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    switch (field) {
      case 'name':
        if (!trimmed) {
          error = 'Employee name is required.';
        } else if (trimmed.length < 2) {
          error = 'Name must be at least 2 characters.';
        } else if (trimmed.length > 100) {
          error = 'Name cannot exceed 100 characters.';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmed) {
          error = 'Email address is required.';
        } else if (!emailRegex.test(trimmed)) {
          error = 'Please enter a valid email address (e.g. name@example.com).';
        }
        break;

      case 'mobile':
        const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!trimmed) {
          error = 'Mobile number is required.';
        } else if (!phoneRegex.test(cleaned)) {
          error = 'Please enter a valid mobile number (e.g. +91 9876543210 or 9876543210).';
        }
        break;

      case 'department':
        if (!trimmed) {
          error = 'Please select a department.';
        }
        break;

      case 'designation':
        if (!trimmed) {
          error = 'Designation is required.';
        } else if (trimmed.length < 2) {
          error = 'Designation must be at least 2 characters.';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      mobile: true,
      department: true,
      designation: true,
    });

    if (validateAll()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditMode ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? `Update details for ${employee?.name}`
                : 'Fill in the details below to register a new employee.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="field-name" className="form-label">
                Employee Name <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  ref={firstInputRef}
                  id="field-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
              {errors.name && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="field-email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  placeholder="e.g. aarav.sharma@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
              {errors.email && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="field-mobile" className="form-label">
                Mobile Number <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  id="field-mobile"
                  name="mobile"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.mobile ? 'input-error' : ''}`}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
              {errors.mobile && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.mobile}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="field-department" className="form-label">
                Department <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-icon" />
                <select
                  id="field-department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input form-select ${errors.department ? 'input-error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select a department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.department}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="field-designation" className="form-label">
                Designation <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-icon" />
                <input
                  id="field-designation"
                  name="designation"
                  type="text"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.designation ? 'input-error' : ''}`}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
              {errors.designation && (
                <div className="field-error-msg">
                  <AlertCircle size={13} />
                  <span>{errors.designation}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="modal-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Employee' : 'Create Employee'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
