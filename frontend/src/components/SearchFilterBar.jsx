import React from 'react';
import { Search, X, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  sortBy,
  sortOrder,
  onSortChange,
  departments = [],
  onRefresh,
  loading = false,
  totalResults = 0,
}) {
  return (
    <div className="search-filter-card">
      <div className="search-filter-row">
        {/* Search input for name or email */}
        <div className="search-input-wrap">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="employee-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="search-clear-btn"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="filter-controls-group">
          {/* Department Filter */}
          <div className="select-wrap">
            <Filter size={16} className="select-icon" />
            <select
              className="custom-select"
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              aria-label="Filter by department"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="select-wrap">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              className="custom-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                onSortChange(newSortBy, newSortOrder);
              }}
              aria-label="Sort employees"
            >
              <option value="id-DESC">Newest Added</option>
              <option value="id-ASC">Oldest Added</option>
              <option value="name-ASC">Name (A → Z)</option>
              <option value="name-DESC">Name (Z → A)</option>
              <option value="department-ASC">Department (A → Z)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="btn btn-secondary btn-icon-only"
            title="Refresh table"
            aria-label="Refresh employees"
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="search-summary-row">
        <span className="results-badge">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'employee' : 'employees'}
        </span>
        {(searchQuery || (departmentFilter && departmentFilter !== 'All')) && (
          <span className="filter-active-indicator">
            Filters active:{' '}
            {searchQuery && <span className="chip">Search: "{searchQuery}"</span>}
            {departmentFilter !== 'All' && <span className="chip">Dept: {departmentFilter}</span>}
            <button
              onClick={() => {
                onSearchChange('');
                onDepartmentChange('All');
              }}
              className="btn-link"
            >
              Reset all
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
