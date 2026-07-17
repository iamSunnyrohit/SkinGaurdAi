import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import DiseaseInfoModal from '../components/DiseaseInfoModal';
import { DISEASE_METADATA } from '../components/ResultCard';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [activeInfoLabel, setActiveInfoLabel] = useState(null);

  const diseases = Object.keys(DISEASE_METADATA).map(name => ({
    name,
    ...DISEASE_METADATA[name]
  }));

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().replace('_', ' ').includes(searchQuery.toLowerCase()) || 
                          disease.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || disease.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div>
      <h1 className="view-title">Disease Reference Catalog</h1>
      <p className="view-subtitle">Clinical classifications and pathology data for HAM10000 image labels.</p>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="learn-filters">
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by label or short code (e.g., mel, nv, bcc)..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Success', 'Warning', 'Danger'].map((severity) => {
              const label = severity === 'All' ? 'All Severities' : severity === 'Success' ? 'Benign' : severity === 'Warning' ? 'Pre-cancerous' : 'Malignant';
              return (
                <button
                  key={severity}
                  onClick={() => setSelectedSeverity(severity)}
                  className={`btn ${selectedSeverity === severity ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disease Card Grid */}
      {filteredDiseases.length > 0 ? (
        <div className="disease-grid">
          {filteredDiseases.map((disease) => {
            const badgeClass = disease.badgeClass;
            return (
              <div key={disease.name} className="glass-card disease-card" style={{ textAlign: 'left' }}>
                <div className="disease-card-header">
                  <h3 className="disease-card-title">{disease.name.replace(/_/g, ' ')}</h3>
                  <span className="disease-card-code">{disease.code.toUpperCase()}</span>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span className={`badge ${badgeClass}`}>
                    {disease.severity === 'Danger' && <ShieldAlert size={12} />}
                    {disease.severity === 'Success' && <ShieldCheck size={12} />}
                    {disease.severity === 'Warning' && <HelpCircle size={12} />}
                    {disease.severity === 'Success' ? 'Benign' : disease.severity === 'Warning' ? 'Pre-cancerous' : 'Malignant'}
                  </span>
                </div>

                <p className="disease-card-body">
                  {disease.description.substring(0, 140)}...
                </p>

                <button 
                  onClick={() => setActiveInfoLabel(disease.name)} 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: 'auto' }}
                >
                  View Details & Pathology
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem 2rem', textStyle: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No diseases match your search criteria.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Try clearing search input or resetting the severity filter to all.
          </p>
        </div>
      )}

      <DiseaseInfoModal 
        diseaseLabel={activeInfoLabel}
        onClose={() => setActiveInfoLabel(null)}
      />
    </div>
  );
};

export default Learn;
