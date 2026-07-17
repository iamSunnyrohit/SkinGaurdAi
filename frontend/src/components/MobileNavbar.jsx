import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/scanner', label: 'Derma Scanner' },
    { path: '/learn', label: 'Disease Catalog' },
    { path: '/history', label: 'Scan History' },
    { path: '/locator', label: 'Find Doctors' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="mobile-navbar">
        <div className="sidebar-logo" style={{ marginBottom: 0 }}>
          <Activity size={24} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '1.15rem' }}>DermaGuard AI</span>
        </div>
        <button 
          className="btn-icon-only" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          style={{ border: 'none', background: 'none' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 190 }}
        >
          <div 
            className="glass-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'fixed', 
              top: '60px', 
              left: '1rem', 
              right: '1rem', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
