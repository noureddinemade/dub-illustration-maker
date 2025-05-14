// src/components/IllustrationCreator/MaskControls.jsx

import React from 'react';

const MaskControls = ({ maskQuadrants, onToggleQuadrant }) => {
  return (
    <div className="mb-6">
      <h2 className="text-md font-medium mb-3 text-gray-700">Mask</h2>
      <div className="grid grid-cols-2 gap-2 max-w-[90px]">
        <button
          className={`w-10 h-10 rounded`}
          onClick={() => onToggleQuadrant('topLeft')}
          title="Top Left"
        >
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 4px, transparent 4px, transparent 10px)',
                opacity: maskQuadrants.topLeft ? 1 : 0.1
              }}></div>
            </div>
          </div>
        </button>
        <button
          className={`w-10 h-10 rounded`}
          onClick={() => onToggleQuadrant('topRight')}
          title="Top Right"
        >
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 4px, transparent 4px, transparent 10px)',
                opacity: maskQuadrants.topRight ? 1 : 0.1
              }}></div>
            </div>
          </div>
        </button>
        <button
          className={`w-10 h-10 rounded`}
          onClick={() => onToggleQuadrant('bottomLeft')}
          title="Bottom Left"
        >
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 4px, transparent 4px, transparent 10px)',
                opacity: maskQuadrants.bottomLeft ? 1 : 0.1
              }}></div>
            </div>
          </div>
        </button>
        <button
          className={`w-10 h-10 rounded`}
          onClick={() => onToggleQuadrant('bottomRight')}
          title="Bottom Right"
        >
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 4px, transparent 4px, transparent 10px)',
                opacity: maskQuadrants.bottomRight ? 1 : 0.1
              }}></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MaskControls;