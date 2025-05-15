import React, { useEffect, useState } from 'react';

// This component will preload images and convert them to data URLs
// to avoid CORS issues when exporting
const ImageCache = ({ onReady }) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // This will hold all image URLs that need to be cached
    const imageUrls = [];
    
    // Extract image URLs from the IMAGES constant
    // We're searching for them in the window object since we can't import directly
    const imagesConst = window.IMAGES || [];
    
    imagesConst.forEach(imageType => {
      if (imageType.variations) {
        imageType.variations.forEach(variation => {
          if (variation.src) {
            imageUrls.push(variation.src);
          }
        });
      }
    });
    
    setTotalCount(imageUrls.length);
    
    // Cache is an object that will store data URLs keyed by the original URL
    window.IMAGE_CACHE = {};
    
    // Process each image
    if (imageUrls.length === 0) {
      setIsReady(true);
      if (onReady) onReady();
    } else {
      imageUrls.forEach(url => {
        // Create an image element to load the image
        const img = new Image();
        
        img.crossOrigin = 'Anonymous';  // Try to avoid CORS issues
        
        img.onload = () => {
          try {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image to the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Get data URL
            try {
              const dataUrl = canvas.toDataURL('image/png');
              window.IMAGE_CACHE[url] = dataUrl;
            } catch (e) {
              console.error('Failed to convert to data URL:', e);
            }
          } catch (e) {
            console.error('Error processing image:', e);
          }
          
          // Update loaded count
          setLoadedCount(prev => {
            const newCount = prev + 1;
            if (newCount >= imageUrls.length) {
              setIsReady(true);
              if (onReady) onReady();
            }
            return newCount;
          });
        };
        
        img.onerror = () => {
          console.error('Failed to load image:', url);
          
          // Update loaded count even for errors
          setLoadedCount(prev => {
            const newCount = prev + 1;
            if (newCount >= imageUrls.length) {
              setIsReady(true);
              if (onReady) onReady();
            }
            return newCount;
          });
        };
        
        // Start loading
        img.src = url;
      });
    }
  }, [onReady]);
  
  if (!isReady) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded shadow-lg z-50">
        Loading images: {loadedCount}/{totalCount}
      </div>
    );
  }
  
  return null; // Component doesn't render anything when done
};

export default ImageCache;