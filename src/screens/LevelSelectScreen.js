import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LevelSelectScreen = ({ playerLevel, selectedCategory, onSelectLevel, onBack }) => {
  const totalLevelsToShow = Math.max(12, playerLevel + 11);
  const levels = Array.from({ length: totalLevelsToShow }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>{selectedCategory.toUpperCase()}</Text>
        <Text style={styles.subtitle}>CHOOSE LEVEL</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {levels.map((level) => {
          const isUnlocked = level <= playerLevel;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelBtn, 
                isUnlocked ? styles.unlockedBtn : styles.lockedBtn
              ]}
              disabled={!isUnlocked}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectLevel(level);
              }}
            >
              <Text style={[styles.levelText, !isUnlocked && styles.lockedText]}>
                {isUnlocked ? level : '🔒'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* BOTTOM-LEFT BACK BUTTON */}
      <TouchableOpacity 
        style={styles.backButtonBottomLeft} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onBack();
        }}
      >
        <Text style={styles.backArrow}>◀</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#2c3e50', alignItems: 'center', paddingTop: 60,
  },
  
  header: {
    alignItems: 'center', marginBottom: 20,
  },
  title: {
    color: '#f1c40f', fontSize: 28, fontWeight: '900', letterSpacing: 2, 
  },
  subtitle: {
    color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, 
    paddingBottom: 100, 
    paddingHorizontal: 10,
  },
  
  // --- BUTTON SIZES ---
  levelBtn: {
    width: 80, height: 80, justifyContent: 'center', alignItems: 'center',
    borderRadius: 15, borderBottomWidth: 6, // Slightly thicker bottom for more pop
  },
  
  // --- UNLOCKED STYLE ---
  unlockedBtn: {
    backgroundColor: '#3498db', 
    borderColor: '#2980b9',
  },
  
  // --- LOCKED STYLE (UPGRADED) ---
  lockedBtn: {
    backgroundColor: '#1a252f', // Dark iron color, clearly separate from the background
    borderColor: '#0f161c',     // Almost black shadow lip so it retains the 3D look
    // Removed opacity so it doesn't look washed out
  },
  
  levelText: {
    color: 'white', fontSize: 28, fontWeight: 'bold',
  },
  
  // --- DIM THE LOCK ICON ---
  lockedText: {
    fontSize: 24,
    opacity: 0.5, // Dims just the lock icon so it doesn't scream for attention
  },

  backButtonBottomLeft: {
    position: 'absolute',
    bottom: 40, 
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: '#34495e', 
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4, 
    borderColor: '#1a252f', 
    zIndex: 10,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backArrow: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -3, 
  },
});

export default LevelSelectScreen;