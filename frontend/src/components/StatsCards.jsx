import React from 'react';
import { Users, Building2, UserCheck, Award } from 'lucide-react';

export default function StatsCards({ stats, employeeCount = 0 }) {
  const departmentCount = stats?.departmentStats?.length || 0;
  const topDept = stats?.departmentStats?.[0]?.department || 'None';
  const topDeptCount = stats?.departmentStats?.[0]?.count || 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Total Employees</span>
          <div className="stat-icon-wrap stat-icon-primary">
            <Users size={20} />
          </div>
        </div>
        <div className="stat-value">{employeeCount}</div>
        <div className="stat-footer text-muted">
          <span className="stat-badge text-success">Active</span> All registered staff
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Departments</span>
          <div className="stat-icon-wrap stat-icon-purple">
            <Building2 size={20} />
          </div>
        </div>
        <div className="stat-value">{departmentCount}</div>
        <div className="stat-footer text-muted">
          Active operational teams
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">Largest Team</span>
          <div className="stat-icon-wrap stat-icon-amber">
            <Award size={20} />
          </div>
        </div>
        <div className="stat-value stat-value-text">{topDept}</div>
        <div className="stat-footer text-muted">
          {topDeptCount > 0 ? `${topDeptCount} team members` : 'No members yet'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-title">System Health</span>
          <div className="stat-icon-wrap stat-icon-emerald">
            <UserCheck size={20} />
          </div>
        </div>
        <div className="stat-value stat-value-text text-success">Healthy</div>
        <div className="stat-footer text-muted">
          Database & REST APIs synced
        </div>
      </div>
    </div>
  );
}
