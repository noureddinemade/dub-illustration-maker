// src/components/IllustrationCreator/ThemeSelector.jsx

import React from 'react';
import { THEMES } from '../../constants';

const ThemeSelector = ({ selectedTheme, selectedVariation, onSelectTheme, onSelectVariation }) => {
  return (
    <div className="mb-6">
      <h2 className="text-md font-medium mb-3 text-gray-700">Theme</h2>
      
      {/* Primary Theme Colors */}
      <div className="grid grid-cols-4 mb-2 max-w-[200px]">
        {Object.entries(THEMES).map(([key, { name, standard }]) => (
          <button
            key={key}
            className={`w-10 h-10 rounded border-4 border-white ${
              selectedTheme === key ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: standard }}
            onClick={() => onSelectTheme(key)}
            title={name}
          />
        ))}
      </div>
      
      {/* Theme Variations */}
      <div className="grid grid-cols-4 max-w-[200px]">
        {['emphasis', 'standard', 'subtle', 'gradient'].map((varType) => {
          const bgColor = varType === 'gradient'
            ? `linear-gradient(to bottom, ${THEMES[selectedTheme].gradient.color}, transparent)`
            : THEMES[selectedTheme][varType];
          
          return (
            <button
              key={varType}
              className={`w-10 h-10 rounded border-4 border-white ${
                selectedVariation === varType ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ background: bgColor }}
              onClick={() => onSelectVariation(varType)}
              title={varType.charAt(0).toUpperCase() + varType.slice(1)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;