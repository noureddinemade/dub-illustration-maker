function organizeImagesWithVariations(filenames) {
    // Create a map to group images by their base name
    const imageGroups = {};
    
    filenames.forEach(filename => {
      // Remove extension
      const filenameWithoutExt = filename.replace('.png', '');
      
      // Extract the base name and variation
      // Example: "face-smile-a" -> baseName: "face-smile", variation: "a"
      const parts = filenameWithoutExt.split('-');
      
      // Check if the last part is a single letter (a, b, c, etc.)
      let baseName = filenameWithoutExt;
      let variation = '';
      
      if (parts.length > 1 && /^[a-z]$/.test(parts[parts.length - 1])) {
        variation = parts.pop();
        baseName = parts.join('-');
      }
      
      // Generate ID and display name for the base object
      const baseId = baseName.replace(/-/g, '_');
      const displayName = baseName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Initialize group if it doesn't exist
      if (!imageGroups[baseName]) {
        imageGroups[baseName] = {
          id: baseId,
          name: displayName,
          variations: []
        };
      }
      
      // Add this variation
      imageGroups[baseName].variations.push({
        id: variation || 'default',
        name: variation ? `Variation ${variation.toUpperCase()}` : 'Default',
        src: `   https://s3-bucket-dubber-brand-assets-global-nonprod.s3.us-west-2.amazonaws.com/illustrations/objects/images/${filename}`
      });
    });

    const result = Object.values(imageGroups);
    
    // Convert the map to an array
    return result;


  }

export default organizeImagesWithVariations