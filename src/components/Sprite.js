import React from 'react';
import { Image, View } from 'react-native';

const Sprite = (props) => {
  const position = props.position || { x: props.x || 0, y: props.y || 0 };
  const { x, y } = position;
  
  const row = props.row || 0;
  const col = props.col || 0;

  // The size of ONE single frame (e.g. 64x64)
  const displaySize = props.size || 64; 

  const scale = props.scale || 1;
  const source = props.source;

  // --- HEALTH LOGIC ---
  const health = props.health;
  const maxHealth = props.maxHealth;
  const showHealth = health !== undefined && maxHealth !== undefined;
  const hpPercent = showHealth ? (health / maxHealth) * 100 : 0;
  const barColor = hpPercent > 50 ? '#2ecc71' : hpPercent > 20 ? '#f1c40f' : '#e74c3c';

  return (
    <View style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: [{ scale: scale }], 
      alignItems: 'center', 
    }}>
      
      {/* --- HEALTH BAR (FIXED) --- */}
      {showHealth && (
        <View style={{
            // FIX: Use a fixed width (32) instead of 'displaySize' (64)
            // This makes the bar tight and compact over the head.
            width: 32, 
            height: 4,            
            backgroundColor: '#2c3e50', 
            // FIX: Push it down a bit so it's not floating too high
            marginTop: 10,
            marginBottom: 2,      
            borderRadius: 2,      
            borderWidth: 0.5,
            borderColor: 'white', 
            justifyContent: 'center', 
            overflow: 'hidden',   
            zIndex: 10 // Ensure it sits on top
        }}>
            <View style={{
                width: `${hpPercent}%`, 
                height: '100%',
                backgroundColor: barColor, 
            }} />
        </View>
      )}

      {/* --- THE SPRITE CROPPER --- */}
      <View style={{
        width: displaySize,   
        height: displaySize,  
        overflow: 'hidden',
      }}>
        <Image
          source={source}
          style={{
            position: 'absolute',
            left: -col * displaySize, 
            top: -row * displaySize,   
          }}
        />
      </View>
    </View>
  );
};

export default Sprite;