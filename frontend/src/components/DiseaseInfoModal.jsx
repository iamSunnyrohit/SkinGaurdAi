import React from 'react';
import { X, ShieldAlert, ShieldCheck, Calendar, Info } from 'lucide-react';
import { DISEASE_METADATA } from './ResultCard';

const DiseaseInfoModal = ({ diseaseLabel, onClose }) => {
  if (!diseaseLabel) return null;

  const label = diseaseLabel;
  const meta = DISEASE_METADATA[label];
  
  if (!meta) return null;

  const severityIcon = () => {
    switch (meta.severity) {
      case 'Danger':
        return <ShieldAlert size={20} style={{ color: 'var(--color-danger)' }} />;
      case 'Warning':
        return <Calendar size={20} style={{ color: 'var(--color-warning)' }} />;
      case 'Success':
      default:
        return <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}
          className="btn-icon-only"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {severityIcon()}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{label.replace('_', ' ')}</h3>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
              Dataset Code: {meta.code}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              CLINICAL DESCRIPTION
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {meta.description}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              RISK ASSESSMENT
            </h4>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: meta.severity === 'Danger' ? 'var(--color-danger-light)' : meta.severity === 'Warning' ? 'var(--color-warning-light)' : 'var(--color-success-light)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: meta.severity === 'Danger' ? 'var(--color-danger)' : meta.severity === 'Warning' ? 'var(--color-warning)' : 'var(--color-success)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}>
              <Info size={16} />
              <span>Severity Level: {meta.severity} - {meta.severity === 'Danger' ? 'Requires Clinical Excision / Biopsy' : meta.severity === 'Warning' ? 'Requires Periodic Professional Observation' : 'Benign lesion. Safe to self-monitor.'}</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              RECOMMENDED NEXT STEPS
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {meta.action}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close Report
            </button>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(label.replace('_', ' ') + ' skin lesion dermatology')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Search Clinical Studies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseInfoModal;
