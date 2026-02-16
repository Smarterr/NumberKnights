import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Removed PlayerBadge import to keep it clean
export default function MenuScreen({ onPlay }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NUMBER KNIGHTS</Text>
      
      <TouchableOpacity style={styles.button} onPress={onPlay}>
        <Text style={styles.buttonText}>PLAY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 40, color: '#FFD700', fontWeight: 'bold', marginBottom: 50 },
  button: { backgroundColor: '#4CAF50', paddingHorizontal: 50, paddingVertical: 15, borderRadius: 25 },
  buttonText: { fontSize: 24, color: 'white', fontWeight: 'bold' }
});