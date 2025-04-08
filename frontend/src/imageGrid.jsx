import React, { useState } from 'react';
import './ImageGrid.css';

const ImageGrid = () => {
  // Initialize the images state with default images
  const initialImages = Array(25).fill('/Farmland.png'); // 5x5 grid, 25 images can change anytime
  const [images, setImages] = useState(initialImages);

  // Function to handle image change for a specific grid item
  // just a template will get changed
  const handleImageChange = (e, index) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...images]; // Copy the current images array
        updatedImages[index] = reader.result; // Update the image at the given index
        setImages(updatedImages); // Update the state with the new images array
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };

  return (
    <div className="grid-container">
      {images.map((image, index) => (
        <div key={index} className="grid-item">
          <img src={image} alt={`img-${index}`} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
