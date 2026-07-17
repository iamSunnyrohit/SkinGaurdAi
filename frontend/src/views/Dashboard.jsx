import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      label: 'Scans Run', 
      value: '24', 
      change: '+4 this week',
      icon: Activity, 
      color: 'var(--color-primary)', 
      bg: 'var(--color-primary-light)' 
    },
    { 
      label: 'Alert Detections', 
      value: '3', 
      change: 'Urgent visits advised',
      icon: ShieldAlert, 
      color: 'var(--color-danger)', 
      bg: 'var(--color-danger-light)' 
    },
    { 
      label: 'Benign Confirmed', 
      value: '19', 
      change: 'Normal skin lesions',
      icon: CheckCircle, 
      color: 'var(--color-success)', 
      bg: 'var(--color-success-light)' 
    },
    { 
      label: 'Classifier Version', 
      value: 'v2.1', 
      change: '94.2% Train Acc',
      icon: TrendingUp, 
      color: 'var(--color-secondary)', 
      bg: 'var(--color-secondary-light)' 
    }
  ];

  const recentScans = [
    { id: 'SC-9842', date: '2026-07-14', diagnosis: 'Melanocytic_Nevi', confidence: '97.2%', status: 'Benign' },
    { id: 'SC-9841', date: '2026-07-12', diagnosis: 'Melanoma', confidence: '88.5%', status: 'Malignant' },
    { id: 'SC-9840', date: '2026-07-10', diagnosis: 'Benign_Keratosis', confidence: '92.1%', status: 'Benign' },
  ];

  return (
    <div>
      <h1 className="view-title">Diagnostics Dashboard</h1>
      <p className="view-subtitle">AI-assisted screening portal for HAM10000 skin lesions.</p>

      {/* Top Welcome Banner */}
      <div className="dashboard-banner">
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h2>DermaGuard Clinical Intelligence</h2>
          <p>
            You can analyze dermatological lesions using our advanced deep learning classification models trained on 10,000+ medical-grade pigmented skin images. Upload photos, review likelihood indexes, and export diagnostic PDF logs.
          </p>
          <button onClick={() => navigate('/scanner')} className="btn btn-primary">
            Start Scanning Session
            <ArrowRight size={18} />
          </button>
        </div>
        <div style={{ fontSize: '5rem', opacity: 0.15, transform: 'rotate(10deg)', display: 'flex', alignItems: 'center' }}>
          🩺
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="stats-row">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card stat-card" style={{ padding: '1.25rem' }}>
              <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info" style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                <h3>{stat.value}</h3>
                <p style={{ fontSize: '0.7rem', color: stat.color, fontWeight: 600 }}>{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Dashboard layout split */}
      <div className="dashboard-grid">
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Scanning Log</h3>
            <button onClick={() => navigate('/history')} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              View All Logs
            </button>
          </div>

          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Scan Date</th>
                  <th>Primary Diagnosis</th>
                  <th>Confidence</th>
                  <th>Clinical Classification</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500 }}>{scan.id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{scan.date}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{scan.diagnosis.replace('_', ' ')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{scan.confidence}</td>
                    <td>
                      <span className={`badge ${scan.status === 'Malignant' ? 'badge-danger' : 'badge-success'}`}>
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Model Info</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NETWORK ARCHITECTURE</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Keras CNN Classifier</p>
            </div>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INPUT RESOLUTION</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>224 x 224 Pixels (RGB)</p>
            </div>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CLASSES DETECTED</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>7 Distinct Skin Lesion Types</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATASET SOURCE</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>HAM10000 Database</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/learn')} 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.6rem 1rem', fontSize: '0.85rem', marginTop: 'auto' }}
          >
            <FileSpreadsheet size={16} />
            <span>Disease Catalog</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
