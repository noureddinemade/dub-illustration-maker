// src/components/IllustrationCreator/ShapeSelector.jsx

import React from 'react';
import { SHAPES } from '../../constants';

const ShapeSelector = ({ selectedShape, onSelectShape }) => {

  const options = Object.entries(SHAPES).map(([key, {name}]) => {

      const shape = SHAPES[key];
      
      return (

        <button
            key={key}
            className={`w-14 h-14 flex items-center justify-center rounded ${
              selectedShape === key 
                ? 'ring-2 ring-blue-500' 
                : ''
            }`}
            onClick={() => onSelectShape(key)}
            title={name}
          >
              <svg width="40" height="40" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={shape.path} fill="black"/>
              </svg>
          </button>

        )

    })

  return (
    <div className="mb-6">
      <h2 className="text-md font-medium mb-3 text-gray-700">Shape</h2>
      <div className="flex">
        { options }
      </div>
    </div>
  );
};

export default ShapeSelector;