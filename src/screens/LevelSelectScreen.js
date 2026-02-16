import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LEVELS } from '../constants/Levels';

const LevelSelectScreen = ({ onSelectLevel, onBack, playerLevel = 1, playerXp = 0 }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>SELECT LEVEL</Text>
        <View style={styles.statsBox}>
          <Text style={styles.statsText}>LVL {playerLevel}</Text>
          <Text style={styles.xpText}>XP: {playerXp}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.levelList}>
        {LEVELS.map((level) => {
          const isLocked = level.id > playerLevel;

          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelButton, isLocked && styles.lockedButton]}
              onPress={() => !isLocked && onSelectLevel(level)}
              disabled={isLocked}
            >
              {/* FIX: If level.name is missing, fallback to 'Level X' */}
              <Text style={styles.levelText}>
                {level.name ? level.name : `Level ${level.id}`}
              </Text>
              
              {isLocked && <Text style={styles.icon}>🔒</Text>}
              {!isLocked && <Text style={styles.icon}>👾 {level.monsterCount}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecf0f1',
    fontFamily: 'monospace',
  },
  statsBox: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  statsText: { color: '#f1c40f', fontWeight: 'bold', fontSize: 18 },
  xpText: { color: '#bdc3c7', fontSize: 18 },

  levelList: {
    paddingBottom: 40,
    alignItems: 'center', // Center the buttons
  },
  levelButton: {
    backgroundColor: '#27ae60',
    width: '90%', // FIX: Makes them look like "boxes" not bars
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15, // Rounder corners
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 5, // 3D effect
    borderColor: '#1e8449',
  },
  lockedButton: {
    backgroundColor: '#7f8c8d',
    borderColor: '#555',
  },
  levelText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  icon: {
    fontSize: 20,
    color: '#dff9fb',
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#c0392b',
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LevelSelectScreen;