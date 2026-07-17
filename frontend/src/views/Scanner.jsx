import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';
import DiseaseInfoModal from '../components/DiseaseInfoModal';

const Scanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [activeInfoLabel, setActiveInfoLabel] = useState(null);

  const handleImageUpload = (imageData) => {
    setSelectedImage(imageData);
    setResults(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResults(null);
    setIsScanning(false);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setResults(null);

    // Simulate model inference time (2.5 seconds)
    setTimeout(() => {
      // Choose a random class to be the dominant prediction
      const classes = [
        'Melanocytic_Nevi', 
        'Melanoma', 
        'Benign_Keratosis', 
        'Basal_Cell_Carcinoma', 
        'Actinic_Keratosis',
        'Dermatofibroma',
        'Vascular_Lesion'
      ];
      
      // Let's bias it towards Melanocytic_Nevi (nv) and Benign_Keratosis (bkl) as they are the most common
      const rand = Math.random();
      let dominantIndex = 0;
      if (rand < 0.5) {
        dominantIndex = 0; // Melanocytic Nevi (most common mole)
      } else if (rand < 0.7) {
        dominantIndex = 2; // Benign Keratosis
      } else {
        dominantIndex = Math.floor(Math.random() * classes.length);
      }

      const dominantClass = classes[dominantIndex];
      const dominantConfidence = 0.65 + Math.random() * 0.30; // 65% to 95%
      
      // Generate remaining confidences summing to (1 - dominantConfidence)
      let remainingProb = 1 - dominantConfidence;
      const otherClasses = classes.filter((_, idx) => idx !== dominantIndex);
      const randomWeights = otherClasses.map(() => Math.random());
      const sumWeights = randomWeights.reduce((a, b) => a + b, 0);
      
      const parsedResults = [
        { label: dominantClass, confidence: dominantConfidence }
      ];

      otherClasses.forEach((cls, idx) => {
        const conf = (randomWeights[idx] / sumWeights) * remainingProb;
        parsedResults.push({ label: cls, confidence: conf });
      });

      // Sort by confidence descending
      parsedResults.sort((a, b) => b.confidence - a.confidence);

      setResults(parsedResults);
      setIsScanning(false);

      // Save scan to sessionStorage to show in mock history
      const savedHistory = JSON.parse(sessionStorage.getItem('derma_scans') || '[]');
      const newScan = {
        id: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        diagnosis: dominantClass,
        confidence: `${(dominantConfidence * 100).toFixed(1)}%`,
        status: ['Melanoma', 'Basal_Cell_Carcinoma', 'Actinic_Keratosis'].includes(dominantClass) ? 'Malignant' : 'Benign',
        imageName: selectedImage.name,
        imagePreview: selectedImage.previewUrl
      };
      sessionStorage.setItem('derma_scans', JSON.stringify([newScan, ...savedHistory]));

    }, 2500);
  };

  return (
    <div>
      <h1 className="view-title">Derma Scanner Portal</h1>
      <p className="view-subtitle">Upload a macroscopic image of the skin lesion for neural network parsing.</p>

      <div className="scanner-grid">
        <ImageUploader 
          selectedImage={selectedImage}
          onImageUpload={handleImageUpload}
          isScanning={isScanning}
          onStartScan={handleStartScan}
          onClear={handleClear}
        />

        <ResultCard 
          results={results}
          onOpenInfo={(label) => setActiveInfoLabel(label)}
        />
      </div>

      <DiseaseInfoModal 
        diseaseLabel={activeInfoLabel}
        onClose={() => setActiveInfoLabel(null)}
      />
    </div>
  );
};

export default Scanner;
