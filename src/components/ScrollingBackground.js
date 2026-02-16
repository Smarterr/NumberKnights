import React from 'react';
import { Dimensions, Image, View } from 'react-native';

const { width } = Dimensions.get("window");

const ScrollingBackground = ({ offset, source }) => {
  // We calculate a cycle that spans TWO screen widths (Normal + Flipped)
  const screenWidth = width;
  const cycle = 2 * screenWidth; 
  
  // Modulo against the double-width cycle
  const x = offset % cycle; 

  return (
    <View style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 
    }}>
      
      {/* 1. First Image (Normal) */}
      <Image 
        source={source}
        resizeMode="cover" // Use cover so it fills without black bars
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: screenWidth, 
          height: '100%', 
        }}
      />

      {/* 2. Second Image (FLIPPED) - Connects perfectly to #1 */}
      <Image 
        source={source}
        resizeMode="cover"
        style={{
          position: 'absolute',
          left: x + screenWidth, // Place it right after the first
          top: 0,
          width: screenWidth,
          height: '100%',
          transform: [{ scaleX: -1 }] // <--- THE MAGIC TRICK (Flips it)
        }}
      />

      {/* 3. Third Image (Normal) - Connects perfectly to #2 */}
       <Image 
        source={source}
        resizeMode="cover"
        style={{
          position: 'absolute',
          left: x + (2 * screenWidth), 
          top: 0,
          width: screenWidth,
          height: '100%',
        }}
      />
      
      {/* 4. Fourth Image (FLIPPED) - Handles the left-side buffer */}
      <Image 
        source={source}
        resizeMode="cover"
        style={{
          position: 'absolute',
          left: x - screenWidth, 
          top: 0,
          width: screenWidth,
          height: '100%',
          transform: [{ scaleX: -1 }] 
        }}
      />
    </View>
  );
};

export default ScrollingBackground;