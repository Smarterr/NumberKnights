import React from 'react';
import { Image, Text, View } from 'react-native';

const TILE_SIZE = 16;
const SPACING = 1; 

const Sprite = (props) => {
  const position = props.position || { x: props.x || 0, y: props.y || 0 };
  const { x, y } = position;
  
  const row = props.row || 0;
  const col = props.col || 0;

  const left = - (col * (TILE_SIZE + SPACING));
  const top = - (row * (TILE_SIZE + SPACING));

  const scale = props.scale || 4;
  const source = props.source;

  // --- HEALTH DATA ---
  const health = props.health;
  const maxHealth = props.maxHealth;
  // Only show if health data exists
  const showHealth = health !== undefined && maxHealth !== undefined;
  // Calculate percentage for the bar width
  const hpPercent = showHealth ? (health / maxHealth) * 100 : 0;

  return (
    <View style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: [{ scale: scale }], 
      alignItems: 'center', // Centers the bar over the sprite
    }}>
      
      {/* === HYBRID HEALTH BAR === */}
      {showHealth && (
        <View style={{
            // 1. THE CONTAINER (Red Background Bar)
            width: TILE_SIZE + 2, // Slightly wider than the sprite
            height: 5,            // Height of the bar
            backgroundColor: '#c0392b', // Dark red background
            marginBottom: 2,      // Spacing above head
            borderWidth: 0.5,
            borderColor: 'black',
            justifyContent: 'center', // Center text vertically
            alignItems: 'center',     // Center text horizontally
            position: 'relative',
            overflow: 'hidden',       // Keeps green bar inside rounded corners if used
        }}>
            {/* 2. THE FILLER (Green Foreground Bar) */}
            <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${hpPercent}%`, // Dynamic Width based on health
                backgroundColor: '#2ecc71' // Bright green
            }} />

            {/* 3. THE TEXT OVERLAY (Sits on top) */}
            <Text style={{
                position: 'absolute', // Ensures it floats over the colored bars
                color: 'white',
                // VERY SMALL FONT because the whole thing is scaled x6 by the parent container
                fontSize: 3.5,       
                fontWeight: '900',   // Extra bold to be readable
                textShadowColor: 'black', // Tiny drop shadow for contrast
                textShadowRadius: 1,
                includeFontPadding: false, // Removes extra gaps above/below text
            }}>
                {health}/{maxHealth}
            </Text>
        </View>
      )}

      {/* === THE SPRITE IMAGE === */}
      <View style={{
        width: TILE_SIZE, 
        height: TILE_SIZE, 
        overflow: 'hidden' 
      }}>
        <Image
          source={source}
          style={{
            width: 918,
            height: 203,
            position: 'absolute',
            left: left, 
            top: top,   
            resizeMode: 'nearest'
          }}
        />
      </View>
    </View>
  );
};

export default Sprite;