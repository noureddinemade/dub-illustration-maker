// src/components/IllustrationCreator/index.jsx

import React, { useState } from 'react';
import ShapeSelector from './ShapeSelector';
import ThemeSelector from './ThemeSelector';
import MaskControls from './MaskControls';
import ImageControls from './ImageControls';
import Preview from './Preview';
import { SHAPES, THEMES } from '../../constants';

const IllustrationCreator = () => {

  const getRandomInitialState = () => {
    // Random shape selection
    const shapeKeys = Object.keys(SHAPES);
    const randomShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    
    // Random theme selection
    const themeKeys = Object.keys(THEMES);
    const randomThemeKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    
    // Random variation selection
    // Standard variations for themes are: 'emphasis', 'standard', 'subtle', 'gradient'
    const variations = ['emphasis', 'standard', 'subtle', 'gradient'];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    
    return {
      shape: randomShapeKey,
      theme: randomThemeKey,
      variation: randomVariation
    };
  };

  const initialState = getRandomInitialState();

  // State for tracking all user selections
  const [shape, setShape] = useState(initialState.shape);
  const [theme, setTheme] = useState(initialState.theme);
  const [variation, setVariation] = useState('standard');
  const [maskQuadrants, setMaskQuadrants] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false
  });
  const [selectedImage, setSelectedImage] = useState('');
  const [imageProps, setImageProps] = useState({
    x: 0,
    y: 0,
    scale: 2,
    rotation: 0
  });

  // Toggle mask quadrant
  const handleToggleQuadrant = (quadrant) => {
    setMaskQuadrants({
      ...maskQuadrants,
      [quadrant]: !maskQuadrants[quadrant]
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-gray-100 p-8 space-y-4 lg:space-y-0 lg:space-x-6 bg-white shadow rounded-lg">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Illustration Creator</h1>
        
        <ShapeSelector 
          selectedShape={shape} 
          onSelectShape={setShape} 
        />
        
        <ThemeSelector
          selectedTheme={theme}
          selectedVariation={variation}
          onSelectTheme={setTheme}
          onSelectVariation={setVariation}
        />
        
        <MaskControls
          maskQuadrants={maskQuadrants}
          onToggleQuadrant={handleToggleQuadrant}
        />
        
        <ImageControls
          selectedImage={selectedImage}
          imageProps={imageProps}
          onSelectImage={setSelectedImage}
          onUpdateImageProps={setImageProps}
        />
      </div>
      
      {/* Preview Panel */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center">
        <Preview
            shape={shape}
            theme={theme}
            variation={variation}
            maskQuadrants={maskQuadrants}
            selectedImage={selectedImage}
            imageProps={imageProps}
            onUpdateImageProps={setImageProps}
          />
      </div>
    </div>
  );
};

export default IllustrationCreator;