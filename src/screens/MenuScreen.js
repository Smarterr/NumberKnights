import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuScreen = ({ onStartGame, onSelectKnight }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>NUMBER</Text>
        <Text style={styles.subtitle}>KNIGHTS</Text>
      </View>

      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => {
           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
           onStartGame(); 
        }}
      >
        <Text style={styles.btnText}>PLAY GAME</Text>
      </TouchableOpacity>
      
      {/* --- UPGRADED SECONDARY BUTTON --- */}
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => {
           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
           onSelectKnight(); 
        }}
      >
        <Text style={styles.secondaryBtnText}>CHOOSE KNIGHT</Text>
      </TouchableOpacity>
      
      <Text style={styles.version}>v1.1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#2c3e50', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
  },
  titleBox: { marginBottom: 60, alignItems: 'center' },
  title: { fontSize: 50, fontWeight: '900', color: 'white', letterSpacing: 5, textAlign: 'center' },
  subtitle: { fontSize: 30, color: '#f1c40f', fontWeight: 'bold', letterSpacing: 2, marginTop: -5 },
  
  startButton: {
    backgroundColor: '#27ae60', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30,
    borderBottomWidth: 5, borderColor: '#1e8449', shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8, marginBottom: 20, width: 280, alignItems: 'center'
  },
  btnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  
  // --- NEW STYLES FOR CHOOSE KNIGHT ---
  secondaryButton: {
    backgroundColor: '#3498db', // Bright, punchy blue
    paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30,
    borderBottomWidth: 5, borderColor: '#2980b9', // Darker blue bottom
    width: 280, alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, // Matches Play Game shadow
    shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8,
  },
  secondaryBtnText: { color: 'white', fontSize: 22, fontWeight: 'bold' }, // Pure white, slightly smaller than Play
  
  version: { position: 'absolute', bottom: 20, color: '#7f8c8d' }
});

export default MenuScreen;