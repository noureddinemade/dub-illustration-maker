// src/components/IllustrationCreator/ImageControls.jsx

import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../../constants';
import { Search, ChevronDown, Move, Maximize, RotateCw } from 'lucide-react';

const ImageControls = ({ selectedImage, imageProps, onSelectImage, onUpdateImageProps }) => {
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Filter images based on search term
  const filteredImages = IMAGES.filter(imageType => 
    imageType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //
  const selectRandomImage = () => {
    if (IMAGES.length === 0) return null;
    
    // Select a random image type
    const randomTypeIndex = Math.floor(Math.random() * IMAGES.length);
    const randomImageType = IMAGES[randomTypeIndex];
    
    // If this type has variations, select a random variation
    if (randomImageType.variations && randomImageType.variations.length > 0) {
      const randomVariationIndex = Math.floor(Math.random() * randomImageType.variations.length);
      const randomVariation = randomImageType.variations[randomVariationIndex];
      
      return {
        imageType: randomImageType,
        variation: randomVariation
      };
    }
    
    return null;
  };
  
// Initialize selections when component loads
useEffect(() => {
  if (!selectedImageType) {
    const randomSelection = selectRandomImage();
    
    if (randomSelection) {
      setSelectedImageType(randomSelection.imageType);
      setSelectedVariation(randomSelection.variation);
      
      // If using the enhanced image selection handler that takes type and variation:
      if (typeof onSelectImage === 'function') {
        if (onSelectImage.length >= 3) {
          // Enhanced version that accepts type and variation
          onSelectImage(
            randomSelection.variation.src, 
            randomSelection.imageType, 
            randomSelection.variation
          );
        } else {
          // Simple version that only accepts the image src
          onSelectImage(randomSelection.variation.src);
        }
      }
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // When image type changes, select the first variation and update
  const handleImageTypeChange = (imageType) => {
    setSelectedImageType(imageType);
    setIsDropdownOpen(false);
    
    if (imageType.variations.length > 0) {
      const firstVariation = imageType.variations[0];
      setSelectedVariation(firstVariation);
      onSelectImage(firstVariation.src);
    }
  };
  
  // When variation changes, update the selected image
  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
    onSelectImage(variation.src);
  };
  
  // Reset functions
  const resetPosition = () => {
    onUpdateImageProps({
      ...imageProps,
      x: 0,
      y: 0
    });
  };
  
  const resetScale = () => {
    onUpdateImageProps({
      ...imageProps,
      scale: 2
    });
  };
  
  const resetRotation = () => {
    onUpdateImageProps({
      ...imageProps,
      rotation: 0
    });
  };
  
  const resetAll = () => {
    onUpdateImageProps({
      x: 0,
      y: 0,
      scale: 2,
      rotation: 0
    });
  };
  
  if (!selectedImageType || !selectedVariation) {
    return <div>Loading images...</div>;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-md font-medium mb-3 text-gray-700">Image</h2>
      
      {/* Object Selection Dropdown */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <div 
          className="flex items-center justify-between px-3 py-2 border rounded bg-white cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-sm">{selectedImageType.name}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
            {/* Search Input */}
            <div className="p-2 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Dropdown Items */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredImages.length > 0 ? (
                filteredImages.map((imageType) => (
                  <div
                    key={imageType.id}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                      selectedImageType.id === imageType.id ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                    onClick={() => handleImageTypeChange(imageType)}
                  >
                    {imageType.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No images found</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Variation Selection - only show if there are variations */}
      {selectedImageType.variations.length > 1 && (
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {selectedImageType.variations.map((variation) => (
              <button
                key={variation.id}
                className={`w-7 h-7 text-sm border rounded ${
                  selectedVariation.id === variation.id 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleVariationChange(variation)}
              >
                {variation.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Adjustments</h3>
          <button
            className="text-xs text-blue-600 hover:text-blue-800"
            onClick={resetAll}
          >
            Reset All
          </button>
        </div>
        
        {/* Position Information */}
        {selectedImage && (
          <div className="mb-4 flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Move size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500">
                Position: X: {Math.round(imageProps.x)}, Y: {Math.round(imageProps.y)}
              </span>
            </div>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={resetPosition}
            >
              Reset
            </button>
          </div>
        )}
        
        {/* Scale Information */}
        {selectedImage && (
          <div className="mb-4 flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Maximize size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500">
                Scale: {imageProps.scale.toFixed(2)}x
              </span>
            </div>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={resetScale}
            >
              Reset
            </button>
          </div>
        )}
        
        {/* Rotation Information */}
        {selectedImage && (
          <div className="mb-4 flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <RotateCw size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500">
                Rotation: {Math.round(imageProps.rotation)}°
              </span>
            </div>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={resetRotation}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageControls;