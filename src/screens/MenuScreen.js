import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuScreen = ({ onStartGame }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        {/* FIX: Updated Title */}
        <Text style={styles.title}>NUMBER</Text>
        <Text style={styles.subtitle}>KNIGHTS</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
        <Text style={styles.btnText}>PLAY GAME</Text>
      </TouchableOpacity>
      
      <Text style={styles.version}>v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',  // Ensure full width
    height: '100%', // Ensure full height
  },
  titleBox: {
    marginBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 30, // Made slightly larger
    color: '#f1c40f', 
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -5,
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderBottomWidth: 5,
    borderColor: '#1e8449',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  version: {
    position: 'absolute',
    bottom: 20,
    color: '#7f8c8d',
  }
});

export default MenuScreen;