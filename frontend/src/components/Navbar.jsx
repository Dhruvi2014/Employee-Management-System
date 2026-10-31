import React from 'react';
import { Users, UserPlus, Database, Sparkles } from 'lucide-react';

export default function Navbar({ onAddClick, totalCount = 0 }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner max-w-7xl">
        <div className="brand-group">
          <div className="brand-logo">
            <Users className="brand-icon" size={26} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">StaffPortal</h1>
              <span className="badge-tech">PERN Stack</span>
            </div>
            <p className="brand-subtitle">Employee Management System</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="status-pill" title="Connected to PostgreSQL Database">
            <span className="status-dot animate-pulse"></span>
            <Database size={14} className="status-icon" />
            <span className="status-label">PostgreSQL Live</span>
          </div>

          <button
            onClick={onAddClick}
            className="btn btn-primary btn-add"
            id="add-employee-btn"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
}
