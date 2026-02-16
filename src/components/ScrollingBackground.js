import React from 'react';
import { Dimensions, Image, View } from 'react-native';

const { width } = Dimensions.get("window");

const ScrollingBackground = ({ offset, source }) => {
  const x = offset % width; 

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      zIndex: -1 
    }}>
      {/* Image 1 */}
      <Image 
        source={source}
        resizeMode="stretch" // <--- CHANGED: Forces the whole image to fit
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: width, 
          height: '100%', 
        }}
      />

      {/* Image 2 (The follower) */}
      <Image 
        source={source}
        resizeMode="stretch" // <--- CHANGED
        style={{
          position: 'absolute',
          left: x + width, 
          top: 0,
          width: width,
          height: '100%',
        }}
      />
    </View>
  );
};

export default ScrollingBackground;