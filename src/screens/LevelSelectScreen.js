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

      {/* Added extra paddingBottom to the grid so levels don't hide behind the button */}
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

      {/* --- MOVED: BOTTOM-LEFT BACK BUTTON --- */}
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
    color: '#f1c40f', fontSize: 28, fontWeight: '900', letterSpacing: 2, // Slightly smaller to fit "MULTIPLICATION" better
  },
  subtitle: {
    color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, 
    paddingBottom: 100, // <--- Increased padding so the bottom row doesn't get covered by the back button
    paddingHorizontal: 10,
  },
  levelBtn: {
    width: 80, height: 80, justifyContent: 'center', alignItems: 'center',
    borderRadius: 15, borderBottomWidth: 5,
  },
  unlockedBtn: {
    backgroundColor: '#3498db', borderColor: '#2980b9',
  },
  lockedBtn: {
    backgroundColor: '#34495e', borderColor: '#2c3e50', opacity: 0.7,
  },
  levelText: {
    color: 'white', fontSize: 28, fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 24,
  },

  // --- NEW STYLES: BOTTOM LEFT FIXED POSITION ---
  backButtonBottomLeft: {
    position: 'absolute',
    bottom: 40, // Keeps it safely above the screen edge
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
    shadowColor: "#000", // Added a little shadow to make it pop over the scrolling grid
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