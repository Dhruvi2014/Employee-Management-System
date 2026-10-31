import React from 'react';
import { Edit2, Trash2, Mail, Phone, Building2, Briefcase, UserX, AlertCircle } from 'lucide-react';

const DEPARTMENT_COLORS = {
  Engineering: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.25)' },
  'Human Resources': { bg: 'rgba(236, 72, 153, 0.12)', text: '#db2777', border: 'rgba(236, 72, 153, 0.25)' },
  Design: { bg: 'rgba(168, 85, 247, 0.12)', text: '#9333ea', border: 'rgba(168, 85, 247, 0.25)' },
  Marketing: { bg: 'rgba(249, 115, 22, 0.12)', text: '#ea580c', border: 'rgba(249, 115, 22, 0.25)' },
  Finance: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', border: 'rgba(168, 85, 247, 0.25)' },
  Product: { bg: 'rgba(14, 165, 233, 0.12)', text: '#0284c7', border: 'rgba(14, 165, 233, 0.25)' },
  'Quality Assurance': { bg: 'rgba(234, 179, 8, 0.12)', text: '#ca8a04', border: 'rgba(234, 179, 8, 0.25)' },
};

function getDepartmentStyle(dept) {
  return DEPARTMENT_COLORS[dept] || {
    bg: 'rgba(107, 114, 128, 0.12)',
    text: '#4b5563',
    border: 'rgba(107, 114, 128, 0.25)',
  };
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

const AVATAR_BG_COLORS = [
  '#4f46e5', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'
];

function getAvatarBg(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
}

export default function EmployeeTable({
  employees,
  loading,
  error,
  onEdit,
  onDelete,
  onClearFilters,
  onRetry,
}) {
  if (loading) {
    return (
      <div className="table-card">
        <div className="skeleton-container">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-text skeleton-wide"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-card empty-card">
        <AlertCircle size={48} className="text-danger empty-icon" />
        <h3 className="empty-title">Failed to Load Employees</h3>
        <p className="empty-desc">{error}</p>
        <button onClick={onRetry} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="table-card empty-card">
        <UserX size={48} className="text-muted empty-icon" />
        <h3 className="empty-title">No Employees Found</h3>
        <p className="empty-desc">
          No employee records match your current search or filter criteria.
        </p>
        {onClearFilters && (
          <button onClick={onClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="custom-table" id="employee-table">
          <thead>
            <tr>
              <th scope="col" className="th-employee">Employee</th>
              <th scope="col">Contact Info</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col" className="th-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const deptStyle = getDepartmentStyle(emp.department);
              const initials = getInitials(emp.name);
              const avatarBg = getAvatarBg(emp.name);

              return (
                <tr key={emp.id} className="table-row-hover">
                  {/* Employee Name & Avatar */}
                  <td>
                    <div className="employee-cell">
                      <div
                        className="avatar-circle"
                        style={{ backgroundColor: avatarBg }}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                      <div className="employee-info">
                        <div className="employee-name">{emp.name}</div>
                        <div className="employee-id">ID: #{emp.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email & Mobile */}
                  <td>
                    <div className="contact-cell">
                      <a
                        href={`mailto:${emp.email}`}
                        className="contact-link"
                        title={`Send email to ${emp.email}`}
                      >
                        <Mail size={14} className="contact-icon text-primary" />
                        <span className="truncate">{emp.email}</span>
                      </a>
                      <a
                        href={`tel:${emp.mobile}`}
                        className="contact-link"
                        title={`Call ${emp.mobile}`}
                      >
                        <Phone size={14} className="contact-icon text-muted" />
                        <span>{emp.mobile}</span>
                      </a>
                    </div>
                  </td>

                  {/* Department Badge */}
                  <td>
                    <span
                      className="dept-badge"
                      style={{
                        backgroundColor: deptStyle.bg,
                        color: deptStyle.text,
                        borderColor: deptStyle.border,
                      }}
                    >
                      <Building2 size={13} style={{ marginRight: '5px' }} />
                      {emp.department}
                    </span>
                  </td>

                  {/* Designation */}
                  <td>
                    <div className="designation-cell">
                      <Briefcase size={14} className="text-muted" />
                      <span>{emp.designation}</span>
                    </div>
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="text-right">
                    <div className="action-buttons-group">
                      <button
                        onClick={() => onEdit(emp)}
                        className="btn-action btn-action-edit"
                        title={`Edit ${emp.name}`}
                        aria-label={`Edit ${emp.name}`}
                        id={`edit-btn-${emp.id}`}
                      >
                        <Edit2 size={15} />
                        <span className="action-label">Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        className="btn-action btn-action-delete"
                        title={`Delete ${emp.name}`}
                        aria-label={`Delete ${emp.name}`}
                        id={`delete-btn-${emp.id}`}
                      >
                        <Trash2 size={15} />
                        <span className="action-label">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
