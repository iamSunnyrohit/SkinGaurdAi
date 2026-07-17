import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';
import Dashboard from './views/Dashboard';
import Scanner from './views/Scanner';
import Learn from './views/Learn';
import History from './views/History';
import DoctorLocator from './views/DoctorLocator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Desktop Navigation Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Header */}
        <MobileNavbar />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/history" element={<History />} />
            <Route path="/locator" element={<DoctorLocator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
