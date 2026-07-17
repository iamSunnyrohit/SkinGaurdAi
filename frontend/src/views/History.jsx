import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';
import DiseaseInfoModal from '../components/DiseaseInfoModal';

const DEFAULT_HISTORY = [
  { 
    id: 'SC-9842', 
    date: '2026-07-14', 
    diagnosis: 'Melanocytic_Nevi', 
    confidence: '97.2%', 
    status: 'Benign',
    imageName: 'lesion_nevus_12.jpg',
    imagePreview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'SC-9841', 
    date: '2026-07-12', 
    diagnosis: 'Melanoma', 
    confidence: '88.5%', 
    status: 'Malignant',
    imageName: 'lesion_asymmetric_7.jpg',
    imagePreview: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'SC-9840', 
    date: '2026-07-10', 
    diagnosis: 'Benign_Keratosis', 
    confidence: '92.1%', 
    status: 'Benign',
    imageName: 'crusty_spot_2.jpg',
    imagePreview: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  { 
    id: 'SC-9839', 
    date: '2026-07-08', 
    diagnosis: 'Basal_Cell_Carcinoma', 
    confidence: '79.3%', 
    status: 'Malignant',
    imageName: 'pearly_nodule_5.jpg',
    imagePreview: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScanDiagnosis, setSelectedScanDiagnosis] = useState(null);

  useEffect(() => {
    const scans = sessionStorage.getItem('derma_scans');
    if (scans) {
      setHistoryList(JSON.parse(scans));
    } else {
      setHistoryList(DEFAULT_HISTORY);
      sessionStorage.setItem('derma_scans', JSON.stringify(DEFAULT_HISTORY));
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your scanning history?")) {
      sessionStorage.removeItem('derma_scans');
      setHistoryList([]);
    }
  };

  const filteredHistory = historyList.filter(scan => {
    return scan.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           scan.diagnosis.toLowerCase().replace('_', ' ').includes(searchQuery.toLowerCase()) || 
           scan.imageName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <h1 className="view-title">Diagnostics Archive</h1>
          <p className="view-subtitle">Review and inspect historical patient lesion scans run during this session.</p>
        </div>
        
        {historyList.length > 0 && (
          <button onClick={handleClearHistory} className="btn btn-secondary" style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search scans by Session ID, diagnosis, or file name..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Log list grid/table */}
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
        {filteredHistory.length > 0 ? (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Session ID</th>
                  <th>Scan Date</th>
                  <th>Image File</th>
                  <th>Primary Diagnosis</th>
                  <th>Confidence</th>
                  <th>Classification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((scan) => (
                  <tr key={scan.id}>
                    <td>
                      <img 
                        src={scan.imagePreview} 
                        alt="Scan Thumbnail" 
                        className="history-thumb"
                      />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 500 }}>
                      {scan.id}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {scan.date}
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.imageName}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {scan.diagnosis.replace(/_/g, ' ')}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {scan.confidence}
                    </td>
                    <td>
                      <span className={`badge ${scan.status === 'Malignant' ? 'badge-danger' : 'badge-success'}`}>
                        {scan.status === 'Malignant' ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                        {scan.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedScanDiagnosis(scan.diagnosis)} 
                        className="btn btn-secondary btn-icon-only"
                        title="View diagnosis guidelines"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <Trash2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Archive is Empty</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              No scanning runs match your filter or search query.
            </p>
          </div>
        )}
      </div>

      <DiseaseInfoModal 
        diseaseLabel={selectedScanDiagnosis}
        onClose={() => setSelectedScanDiagnosis(null)}
      />
    </div>
  );
};

export default History;
