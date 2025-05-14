// src/components/IllustrationCreator/Preview.jsx

import React, { useRef, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { THEMES, SHAPES } from '../../constants';

const Preview = ({ shape, theme, variation, maskQuadrants, selectedImage, imageProps, onUpdateImageProps }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isSelected, setIsSelected] = useState(false);
  const [interactionMode, setInteractionMode] = useState(null); // 'move', 'scale', or 'rotate'
  const [interactionStart, setInteractionStart] = useState({ x: 0, y: 0 });
  const [initialProps, setInitialProps] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [initialAngle, setInitialAngle] = useState(0);
  
  const shapeData = SHAPES[shape];
  
  // Get color based on current theme and variation
  const getColor = () => {
    if (variation === 'gradient') {
      return `url(#${theme}Gradient)`;
    }
    return THEMES[theme][variation];
  };
  
  // Calculate the bounds of the object for the selection box
  const getObjectBounds = () => {
    // These values should be adjusted based on the actual object size and position
    const width = shapeData.imageDefaults.width * imageProps.scale;
    const height = shapeData.imageDefaults.height * imageProps.scale;
    const centerX = shapeData.center.x + imageProps.x;
    const centerY = shapeData.center.y + imageProps.y;
    
    const left = centerX - width / 2;
    const top = centerY - height / 2;
    
    return {
      left,
      top,
      width,
      height,
      centerX,
      centerY
    };
  };
  
  // Handle mouse down on the object
  const handleObjectMouseDown = (e) => {
    if (!selectedImage) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Scale mouse coordinates to SVG coordinate space
    const scaleFactor = 1200 / svgRect.width; // 1200 is the viewBox width
    const svgMouseX = mouseX * scaleFactor;
    const svgMouseY = mouseY * scaleFactor;
    
    setIsSelected(true);
    setInteractionMode('move');
    setInteractionStart({ x: svgMouseX, y: svgMouseY });
    setInitialProps({ ...imageProps });
    
    // Add custom cursor class
    if (containerRef.current) {
      containerRef.current.classList.add('grabbing-cursor');
    }
  };
  
  // Handle mouse down on the scale handle
  const handleScaleMouseDown = (e) => {
    if (!selectedImage || !isSelected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Scale mouse coordinates to SVG coordinate space
    const scaleFactor = 1200 / svgRect.width;
    const svgMouseX = mouseX * scaleFactor;
    const svgMouseY = mouseY * scaleFactor;
    
    setInteractionMode('scale');
    setInteractionStart({ x: svgMouseX, y: svgMouseY });
    setInitialProps({ ...imageProps });
    
    // Calculate the initial distance from center for scaling
    const bounds = getObjectBounds();
    const initialDistance = Math.sqrt(
      Math.pow(svgMouseX - bounds.centerX, 2) + 
      Math.pow(svgMouseY - bounds.centerY, 2)
    );
    setInitialAngle(initialDistance);
    
    // Add custom cursor class
    if (containerRef.current) {
      containerRef.current.classList.add('scaling-cursor');
    }
  };
  
  // Handle mouse down on the rotate handle
  const handleRotateMouseDown = (e) => {
    if (!selectedImage || !isSelected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Scale mouse coordinates to SVG coordinate space
    const scaleFactor = 1200 / svgRect.width;
    const svgMouseX = mouseX * scaleFactor;
    const svgMouseY = mouseY * scaleFactor;
    
    setInteractionMode('rotate');
    setInteractionStart({ x: svgMouseX, y: svgMouseY });
    setInitialProps({ ...imageProps });
    
    // Calculate the initial angle for rotation
    const bounds = getObjectBounds();
    const initialAngle = Math.atan2(
      svgMouseY - bounds.centerY,
      svgMouseX - bounds.centerX
    ) * (180 / Math.PI);
    setInitialAngle(initialAngle);
    
    // Add custom cursor class
    if (containerRef.current) {
      containerRef.current.classList.add('rotating-cursor');
    }
  };
  
  // Handle mouse down on the background (deselect)
  const handleBackgroundMouseDown = (e) => {
    // Only deselect if we click directly on the background
    // and not on any other interactive elements
    if (isSelected && e.target === e.currentTarget) {
      setIsSelected(false);
    }
  };
  
  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!interactionMode) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Scale mouse coordinates to SVG coordinate space
    const scaleFactor = 1200 / svgRect.width;
    const svgMouseX = mouseX * scaleFactor;
    const svgMouseY = mouseY * scaleFactor;
    
    const bounds = getObjectBounds();
    
    if (interactionMode === 'move') {
      // Calculate the displacement
      const dx = svgMouseX - interactionStart.x;
      const dy = svgMouseY - interactionStart.y;
      
      // Update position
      onUpdateImageProps({
        ...imageProps,
        x: initialProps.x + dx,
        y: initialProps.y + dy
      });
    } 
    else if (interactionMode === 'scale') {
      // Calculate the current distance from center
      const currentDistance = Math.sqrt(
        Math.pow(svgMouseX - bounds.centerX, 2) + 
        Math.pow(svgMouseY - bounds.centerY, 2)
      );
      
      // Calculate the distance ratio for scaling
      // We use the initial distance as a baseline and scale relative to it
      const initialDistance = Math.sqrt(
        Math.pow(interactionStart.x - bounds.centerX, 2) + 
        Math.pow(interactionStart.y - bounds.centerY, 2)
      );
      
      const scaleRatio = currentDistance / initialDistance;
      const newScale = Math.max(0.5, Math.min(5, initialProps.scale * scaleRatio));
      
      // Update scale
      onUpdateImageProps({
        ...imageProps,
        scale: newScale
      });
    } 
    else if (interactionMode === 'rotate') {
      // Calculate the current angle
      const currentAngle = Math.atan2(
        svgMouseY - bounds.centerY,
        svgMouseX - bounds.centerX
      ) * (180 / Math.PI);
      
      // Calculate the angle difference
      let angleDiff = currentAngle - initialAngle;
      
      // Add to the initial rotation (and normalize to -180 to 180)
      let newRotation = initialProps.rotation + angleDiff;
      while (newRotation > 180) newRotation -= 360;
      while (newRotation < -180) newRotation += 360;
      
      // Update rotation
      onUpdateImageProps({
        ...imageProps,
        rotation: newRotation
      });
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (!interactionMode) return;
    
    // Important: We only reset the interaction mode but keep isSelected true
    setInteractionMode(null);
    
    // Remove cursor classes
    if (containerRef.current) {
      containerRef.current.classList.remove('grabbing-cursor');
      containerRef.current.classList.remove('scaling-cursor');
      containerRef.current.classList.remove('rotating-cursor');
    }
  };
  
  // Handle click outside
  const handleClickOutside = (e) => {
    // Check if the click is outside both the preview container and any potential modal/dropdown
    if (isSelected && containerRef.current && !containerRef.current.contains(e.target)) {
      // Make sure we're not clicking on a control panel element that might be interacting with the preview
      const isControlPanelElement = e.target.closest('.control-panel');
      if (!isControlPanelElement) {
        setIsSelected(false);
      }
    }
  };
  
// Add and remove event listeners
useEffect(() => {
  if (interactionMode) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
  
  // Add click outside listener when selected
  if (isSelected) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
  
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousedown', handleClickOutside);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [interactionMode, isSelected, interactionStart, initialProps, initialAngle]);
  
  // Watch for changes in the selected shape, theme, etc., and deselect when they change
  useEffect(() => {
    // Deselect when key properties change
    setIsSelected(false);
  }, [shape, theme, variation, selectedImage]);
  
  // Create a unique ID for this component instance
  const uid = React.useMemo(() => Math.random().toString(36).substring(2, 9), []);
  
  // Export the illustration as PNG - FIXED EXPORT CODE
  const exportAsPNG = () => {
    if (!selectedImage) {
      createExportSvg(null);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/png');
      
      createExportSvg(imageDataUrl);
    };
    
    img.onerror = (e) => {
      console.error('Error loading image for export:', e);
      alert('Error loading image for export.');
      createExportSvg(null);
    };
    
    img.src = selectedImage;
  };

  const createExportSvg = (imageDataUrl) => {
    // Create a new SVG element that explicitly includes all components
    const exportSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    exportSvg.setAttribute('width', '1200');
    exportSvg.setAttribute('height', '1200');
    exportSvg.setAttribute('viewBox', shapeData.viewBox);
    exportSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    exportSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Create defs section
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Add gradients
    Object.entries(THEMES).forEach(([themeKey, themeData]) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', `${themeKey}Gradient-export`);
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '0%');
      gradient.setAttribute('y2', '100%');
      
      themeData.gradient.stops.forEach(stop => {
        const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopEl.setAttribute('offset', stop.offset);
        stopEl.setAttribute('stop-color', themeData.gradient.color);
        stopEl.setAttribute('stop-opacity', stop.opacity);
        gradient.appendChild(stopEl);
      });
      
      defs.appendChild(gradient);
    });
    
    // Create mask
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', 'shapeMask-export');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0');
    mask.setAttribute('y', '0');
    mask.setAttribute('width', '1200');
    mask.setAttribute('height', '1200');
    
    // Add the base shape to the mask
    const basePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    basePath.setAttribute('d', shapeData.maskPaths.base);
    basePath.setAttribute('fill', 'white');
    mask.appendChild(basePath);
    
    // Add quadrant paths based on maskQuadrants
    if (!maskQuadrants.topLeft) {
      const topLeftPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      topLeftPath.setAttribute('d', shapeData.maskPaths.quadrants.topLeft);
      topLeftPath.setAttribute('fill', 'white');
      mask.appendChild(topLeftPath);
    }
    
    if (!maskQuadrants.topRight) {
      const topRightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      topRightPath.setAttribute('d', shapeData.maskPaths.quadrants.topRight);
      topRightPath.setAttribute('fill', 'white');
      mask.appendChild(topRightPath);
    }
    
    if (!maskQuadrants.bottomLeft) {
      const bottomLeftPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      bottomLeftPath.setAttribute('d', shapeData.maskPaths.quadrants.bottomLeft);
      bottomLeftPath.setAttribute('fill', 'white');
      mask.appendChild(bottomLeftPath);
    }
    
    if (!maskQuadrants.bottomRight) {
      const bottomRightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      bottomRightPath.setAttribute('d', shapeData.maskPaths.quadrants.bottomRight);
      bottomRightPath.setAttribute('fill', 'white');
      mask.appendChild(bottomRightPath);
    }
    
    defs.appendChild(mask);
    exportSvg.appendChild(defs);
    
    // Create main group
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add colored shape
    const shapePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shapePath.setAttribute('d', shapeData.path);
    
    // Set fill color based on theme and variation
    if (variation === 'gradient') {
      shapePath.setAttribute('fill', `url(#${theme}Gradient-export)`);
    } else {
      shapePath.setAttribute('fill', THEMES[theme][variation]);
    }
    
    mainGroup.appendChild(shapePath);
    
    // Add image with mask
    if (imageDataUrl) {
      const imageGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      imageGroup.setAttribute('mask', 'url(#shapeMask-export)');
      
      // Create image element
      const imageEl = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      imageEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageDataUrl);
      imageEl.setAttribute('x', shapeData.imageDefaults.x);
      imageEl.setAttribute('y', shapeData.imageDefaults.y);
      imageEl.setAttribute('width', shapeData.imageDefaults.width);
      imageEl.setAttribute('height', shapeData.imageDefaults.height);
      imageEl.setAttribute('transform', `translate(${shapeData.center.x + imageProps.x}, ${shapeData.center.y + imageProps.y}) scale(${imageProps.scale}) translate(-${shapeData.center.x}, -${shapeData.center.y}) rotate(${imageProps.rotation}, ${shapeData.center.x}, ${shapeData.center.y})`);
      imageEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      imageGroup.appendChild(imageEl);
      mainGroup.appendChild(imageGroup);
    }
    
    exportSvg.appendChild(mainGroup);
    
    // Convert the constructed SVG to a data URL
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(exportSvg);
    
    // Create a Blob from the SVG string
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    // Create an image element to render the SVG
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      
      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Clean up
      URL.revokeObjectURL(url);
      
     // Clean object name
	let objectName = selectedImage;
		objectName = objectName.replace('./images/','');
		objectName = objectName.replace('.png','');
	  
	  // Convert to PNG and download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${shape}-${objectName}.png`;
      link.href = pngUrl;
      link.click();
    };
    
    img.onerror = (e) => {
      console.error('Error loading SVG:', e);
      URL.revokeObjectURL(url);
      console.log('SVG that failed to load:', svgStr); // Log the SVG for debugging
      alert('Error exporting image. Check console for details.');
    };
    
    img.src = url;
  };
  
  // Calculate object bounds for the selection box
  const bounds = getObjectBounds();
  
  // Preview SVG element
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-lg font-medium text-gray-500 mb-6">Preview</h2>
      
      <div 
        ref={containerRef}
        className={`w-full max-w-[600px] bg-gray-50 rounded-lg overflow-hidden shadow-inner mb-8 relative ${
          selectedImage && !isSelected ? 'cursor-pointer' : ''
        }`}
        onMouseDown={handleBackgroundMouseDown}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={shapeData.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              {THEMES.primary.gradient.stops.map((stop, idx) => (
                <stop 
                  key={idx}
                  offset={stop.offset} 
                  stopColor={THEMES.primary.gradient.color} 
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              {THEMES.secondary.gradient.stops.map((stop, idx) => (
                <stop 
                  key={idx}
                  offset={stop.offset} 
                  stopColor={THEMES.secondary.gradient.color} 
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
            <linearGradient id="tertiaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              {THEMES.tertiary.gradient.stops.map((stop, idx) => (
                <stop 
                  key={idx}
                  offset={stop.offset} 
                  stopColor={THEMES.tertiary.gradient.color} 
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
            <linearGradient id="lightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              {THEMES.light.gradient.stops.map((stop, idx) => (
                <stop 
                  key={idx}
                  offset={stop.offset} 
                  stopColor={THEMES.light.gradient.color} 
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
            
            {/* Create mask to show visible quadrants via the alpha channel */}
            <mask id={`shapeMask-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="1200">
              {/* The base shape is always included in the mask */}
              <path 
                d={shapeData.maskPaths.base} 
                fill="white"
              />
              
              {/* Add visible quadrants to the mask according to the options selected in the UI */}
              {!maskQuadrants.topLeft && (
                <path
                  d={shapeData.maskPaths.quadrants.topLeft}
                  fill="white"
                />
              )}
              
              {!maskQuadrants.topRight && (
                <path
                  d={shapeData.maskPaths.quadrants.topRight}
                  fill="white"
                />
              )}
              
              {!maskQuadrants.bottomLeft && (
                <path
                  d={shapeData.maskPaths.quadrants.bottomLeft}
                  fill="white"
                />
              )}
              
              {!maskQuadrants.bottomRight && (
                <path
                  d={shapeData.maskPaths.quadrants.bottomRight}
                  fill="white"
                />
              )}
            </mask>
            
            {/* Clip path for the entire SVG */}
            <clipPath id={`clipBoundary-${uid}`}>
              <rect width="1200" height="1200" fill="white" />
            </clipPath>
          </defs>
          
          {/* Main graphic group */}
          <g clipPath={`url(#clipBoundary-${uid})`}>
            {/* Draw the colored shape */}
            <path 
              d={shapeData.path} 
              fill={getColor()}
            />
            
            {/* Apply the mask to the image */}
            {selectedImage && (
              <g mask={`url(#shapeMask-${uid})`}>
                <image
                  href={selectedImage}
                  x={shapeData.imageDefaults.x}
                  y={shapeData.imageDefaults.y}
                  width={shapeData.imageDefaults.width}
                  height={shapeData.imageDefaults.height}
                  transform={`translate(${shapeData.center.x + imageProps.x}, ${shapeData.center.y + imageProps.y}) scale(${imageProps.scale}) translate(-${shapeData.center.x}, -${shapeData.center.y}) rotate(${imageProps.rotation}, ${shapeData.center.x}, ${shapeData.center.y})`}
                  preserveAspectRatio="xMidYMid meet"
                  pointerEvents="visible"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSelected(true);
                  }}
                  onMouseDown={handleObjectMouseDown}
                  style={{ cursor: isSelected ? 'move' : 'pointer' }}
                />
              </g>
            )}
            
            {/* Selection box and control points */}
            {isSelected && selectedImage && (
              <>
                {/* Selection box */}
                <rect
                  x={bounds.left}
                  y={bounds.top}
                  width={bounds.width}
                  height={bounds.height}
                  fill="none"
                  stroke="#1E88E5"
                  strokeWidth="2"
                  pointerEvents="none"
                  transform={`rotate(${imageProps.rotation}, ${bounds.centerX}, ${bounds.centerY})`}
                />
                
                {/* Scale handle (bottom left) */}
                <rect
                  x={bounds.left - 10}
                  y={bounds.top + bounds.height - 10}
                  width="20"
                  height="20"
                  fill="#1E88E5"
                  transform={`rotate(${imageProps.rotation}, ${bounds.centerX}, ${bounds.centerY})`}
                  style={{ cursor: 'nesw-resize' }}
                  onMouseDown={handleScaleMouseDown}
                />
                
                {/* Rotate handle (top right) */}
                <circle
                  cx={bounds.left + bounds.width + 10}
                  cy={bounds.top - 10}
                  r="10"
                  fill="#1E88E5"
                  transform={`rotate(${imageProps.rotation}, ${bounds.centerX}, ${bounds.centerY})`}
                  style={{ cursor: 'grab' }}
                  onMouseDown={handleRotateMouseDown}
                />
              </>
            )}
          </g>
        </svg>
      </div>
      
      {selectedImage && (
        <p className="text-sm text-gray-500 mb-4">
          {isSelected 
            ? "Use the blue handles to adjust the image"
            : "Click on the image to select and adjust it"
          }
        </p>
      )}
      
      <button
        onClick={exportAsPNG}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
      >
        <Download size={18} />
        Export PNG
      </button>
    </div>
  );
};

export default Preview;