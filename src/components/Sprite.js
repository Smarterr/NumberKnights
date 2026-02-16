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

  // --- HEALTH LOGIC ---
  const health = props.health;
  const maxHealth = props.maxHealth;
  const showHealth = health !== undefined && maxHealth !== undefined;
  const hpPercent = showHealth ? (health / maxHealth) * 100 : 0;

  // Color Logic: Green if high, Yellow if mid, Red if low
  const barColor = hpPercent > 50 ? '#2ecc71' : hpPercent > 20 ? '#f1c40f' : '#e74c3c';

  return (
    <View style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: [{ scale: scale }], 
      alignItems: 'center', 
    }}>
      
      {/* === PRO HEALTH BAR === */}
      {showHealth && (
        <View style={{
            width: TILE_SIZE + 4, // Wider than sprite
            height: 4,            // Sleek height
            backgroundColor: '#2c3e50', // Dark Charcoal Background
            marginBottom: 3,      
            borderRadius: 2,      // Rounded corners
            borderWidth: 0.5,
            borderColor: 'white', // Crisp border
            justifyContent: 'center', 
            overflow: 'hidden',   
        }}>
            {/* The Fill Bar */}
            <View style={{
                width: `${hpPercent}%`, 
                height: '100%',
                backgroundColor: barColor, // Dynamic Color
            }} />
        </View>
      )}
      
      {/* Text Number (Floats above the bar) */}
      {showHealth && (
        <Text style={{
            position: 'absolute',
            top: -5, // Sit right on top of the bar
            color: 'white',
            fontSize: 3,       
            fontWeight: 'bold',
            textShadowColor: 'black',
            textShadowRadius: 1,
            zIndex: 10,
        }}>
            {health}/{maxHealth}
        </Text>
      )}

      {/* === SPRITE IMAGE === */}
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