import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Trash2, ShieldAlert } from 'lucide-react';

const ImageUploader = ({ onImageUpload, isScanning, onStartScan, selectedImage, onClear }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Only accept image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload({
          file: file,
          previewUrl: event.target.result,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG, JPG, etc.).");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lesion Image Upload</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-1rem' }}>
        For highest accuracy, upload a clear, well-lit, close-up photograph of the skin lesion.
      </p>

      {!selectedImage ? (
        <div 
          className={`uploader-box ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleChange}
          />
          <div className="upload-icon-wrapper">
            <UploadCloud size={32} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Drag & drop lesion image
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Supports JPG, JPEG, PNG formats
            </p>
          </div>
          <button type="button" className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
            Browse Local Files
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="scanner-container image-preview-container">
            {isScanning && <div className="scanner-line"></div>}
            <img 
              src={selectedImage.previewUrl} 
              alt="Lesion Preview" 
              className="image-preview" 
              style={{ filter: isScanning ? 'brightness(0.7)' : 'none', transition: 'filter var(--transition-normal)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileImage size={18} style={{ color: 'var(--color-primary)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedImage.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedImage.size}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={onClear} 
                className="btn btn-secondary" 
                disabled={isScanning}
                style={{ padding: '0.6rem 1rem' }}
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
              <button 
                onClick={onStartScan} 
                className="btn btn-primary" 
                disabled={isScanning}
                style={{ padding: '0.6rem 1.5rem' }}
              >
                {isScanning ? 'Analyzing...' : 'Run Diagnostics'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="clinical-warning" style={{ margin: 0, padding: '0.75rem 1rem' }}>
        <ShieldAlert size={20} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
        <p style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
          <strong>Attention:</strong> Diagnostic analyses are powered by AI models. They are intended for educational and preliminary screening references only and DO NOT replace professional medical consults.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
