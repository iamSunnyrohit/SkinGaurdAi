import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  BookOpen,
  History,
  MapPin,
  Activity,
  Heart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scanner', label: 'Derma Scanner', icon: ScanLine },
    { path: '/learn', label: 'Disease Catalog', icon: BookOpen },
    { path: '/history', label: 'Scan History', icon: History },
    { path: '/locator', label: 'Find Doctors', icon: MapPin },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <Activity size={28} className="logo-icon" style={{ color: 'var(--color-primary)' }} />
          <span>Skin Guard AI</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user" style={{ marginBottom: '1rem' }}>
          <div className="user-avatar">SG</div>
          <div className="user-info">
            <h4>Skin Guard</h4>
            <p>AI App</p>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Made with <Heart size={10} style={{ color: 'var(--color-danger)', fill: 'var(--color-danger)' }} /> for healthcare
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
