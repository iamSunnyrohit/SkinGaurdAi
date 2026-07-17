import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, AlertCircle, Phone, Info, Globe, Building2, Map } from 'lucide-react';

const DoctorLocator = () => {
  const [locationInput, setLocationInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('dermatologist near me');
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, ip-success, error
  const [clinicsList, setClinicsList] = useState([]);
  const [clinicsLoading, setClinicsLoading] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState(null);

  useEffect(() => {
    // Attempt browser geolocation on mount
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      fetchIPLocation();
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserCoords(coords);
        setLocationStatus('success');
        setSearchQuery(`dermatologist near ${latitude},${longitude}`);
        fetchNearbyClinics(latitude, longitude);
      },
      (error) => {
        console.warn("GPS failed, trying IP fallback...", error);
        fetchIPLocation();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const fetchIPLocation = async () => {
    try {
      setLocationStatus('loading');
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        if (data.city && data.region) {
          const region = data.region_code || data.region;
          const resolvedLoc = `${data.city}, ${region}`;
          setLocationInput(resolvedLoc);
          setSearchQuery(`dermatologist in ${resolvedLoc}`);
          setLocationStatus('ip-success');

          // Resolve coordinates using OpenStreetMap Nominatim for clinic lookup
          resolveCityCoordinates(resolvedLoc);
          return;
        }
      }
      throw new Error('Fallback to default');
    } catch (err) {
      console.error("IP geolocation failed:", err);
      setLocationStatus('error');
      setSearchQuery('dermatologist near me');
      setClinicsList([]);
    }
  };

  const resolveCityCoordinates = async (cityName) => {
    try {
      setClinicsLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'DermaGuard-Skin-Detector-App' }
      });
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          setUserCoords({ lat, lng: lon });
          fetchNearbyClinics(lat, lon);
          return;
        }
      }
      throw new Error('Nominatim query failed');
    } catch (err) {
      console.error("Nominatim coordinate resolution failed:", err);
      setClinicsLoading(false);
    }
  };

  const fetchNearbyClinics = async (lat, lng) => {
    setClinicsLoading(true);
    try {
      // Query OpenStreetMap Overpass API for healthcare facilities (hospitals, clinics, doctors) in a 15km radius
      const query = `[out:json][timeout:15];node(around:15000,${lat},${lng})["amenity"~"hospital|doctors|clinic"];out 20;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.elements && data.elements.length > 0) {
          const parsedClinics = data.elements
            .filter(el => el.tags && el.tags.name)
            .map(el => {
              const tags = el.tags;
              const street = tags['addr:street'] || '';
              const num = tags['addr:housenumber'] || '';
              const city = tags['addr:city'] || '';
              const address = [num, street, city].filter(Boolean).join(' ') || 'Address details on map';
              
              let type = 'Clinic';
              if (tags.amenity === 'hospital') type = 'Hospital / Medical Center';
              else if (tags.amenity === 'doctors') type = 'Dermatologist / Doctor';

              return {
                id: el.id,
                name: tags.name,
                type: type,
                address: address,
                phone: tags.phone || tags['contact:phone'] || tags['contact:mobile'] || 'Call via Maps details',
                website: tags.website || tags['contact:website'] || null,
                lat: el.lat,
                lon: el.lon
              };
            });
          
          setClinicsList(parsedClinics);
          if (parsedClinics.length > 0) {
            setSelectedClinicId(parsedClinics[0].id);
          }
        } else {
          setClinicsList([]);
        }
      } else {
        throw new Error('Overpass server response error');
      }
    } catch (err) {
      console.error("Failed fetching Overpass clinics:", err);
      setClinicsList([]);
    } finally {
      setClinicsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (locationInput.trim()) {
      const query = `dermatologist in ${locationInput.trim()}`;
      setSearchQuery(query);
      resolveCityCoordinates(locationInput.trim());
    } else {
      requestGeolocation();
    }
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinicId(clinic.id);
    // Setting query to name + address triggers a precise map focus
    setSearchQuery(`${clinic.name}, ${clinic.address}`);
  };

  const handleQuickFilter = (type) => {
    let prefix = 'dermatologist';
    if (type === 'cancer') {
      prefix = 'skin cancer screening clinic';
    } else if (type === 'pediatric') {
      prefix = 'pediatric dermatologist';
    } else if (type === 'surgery') {
      prefix = 'dermatologic surgeon';
    }

    if (locationInput.trim()) {
      setSearchQuery(`${prefix} in ${locationInput.trim()}`);
    } else if (userCoords) {
      setSearchQuery(`${prefix} near ${userCoords.lat},${userCoords.lng}`);
      fetchNearbyClinics(userCoords.lat, userCoords.lng);
    } else {
      setSearchQuery(`${prefix} near me`);
    }
  };

  return (
    <div>
      <h1 className="view-title">Dermatology Clinic Locator</h1>
      <p className="view-subtitle">Connect with skin specialist doctors and clinical centers near you using Google Maps.</p>

      <div className="locator-grid" style={{ height: '650px', display: 'grid', gridTemplateColumns: '400px minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* Left Side Info Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', textAlign: 'left', height: '100%', overflow: 'hidden' }}>
          
          {/* Location Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Enter city, state, or ZIP..." 
                className="search-input"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Search size={14} />
                <span>Search Area</span>
              </button>
              <button 
                type="button" 
                onClick={requestGeolocation} 
                className="btn btn-secondary btn-icon-only"
                title="Use current GPS location"
                disabled={locationStatus === 'loading'}
                style={{ width: '38px', height: '38px' }}
              >
                <Navigation size={14} style={{ color: locationStatus === 'success' ? 'var(--color-primary)' : 'inherit' }} />
              </button>
            </div>
          </form>

          {/* Location Status Text */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Info size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {locationStatus === 'idle' && 'GPS location ready.'}
              {locationStatus === 'loading' && 'Finding coordinates...'}
              {locationStatus === 'success' && 'GPS coordinates loaded.'}
              {locationStatus === 'ip-success' && `Area loaded via IP: ${locationInput}`}
              {locationStatus === 'error' && 'Failed to locate. Using defaults.'}
            </span>
          </div>

          {/* Quick Filter Tag Row */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            <button onClick={() => handleQuickFilter('cancer')} className="badge badge-danger" style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              Screening
            </button>
            <button onClick={() => handleQuickFilter('surgery')} className="badge badge-primary" style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              Mohs Surgery
            </button>
            <button onClick={() => handleQuickFilter('pediatric')} className="badge badge-success" style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              Pediatric
            </button>
          </div>

          {/* Dynamic Medical Listings */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: '0.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
              <span>Resolved Listings ({clinicsList.length})</span>
            </h4>

            {clinicsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid var(--border-color)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fetching local medical facilities...</p>
              </div>
            ) : clinicsList.length > 0 ? (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                {clinicsList.map((clinic) => {
                  const isSelected = selectedClinicId === clinic.id;
                  return (
                    <div
                      key={clinic.id}
                      onClick={() => handleClinicSelect(clinic)}
                      style={{
                        padding: '0.85rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                        transition: 'all var(--transition-fast)',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        {clinic.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className={`badge ${clinic.type === 'Hospital / Medical Center' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                          {clinic.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                        <MapPin size={12} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clinic.address}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={12} style={{ flexShrink: 0 }} />
                        <span>{clinic.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.5rem', textAlign: 'center', padding: '1rem' }}>
                <Map size={32} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No Facilities Listed</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  We couldn't resolve OSM facility details in this quadrant. Search on Google Maps directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Maps Iframe */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '100%', position: 'relative' }}>
          <iframe
            title="Google Maps Doctor Locator"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default DoctorLocator;
