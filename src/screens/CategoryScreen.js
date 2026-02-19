import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CategoryScreen = ({ onSelectCategory, onBack }) => {
  const categories = [
    { id: 'addition', name: 'ADDITION', difficulty: 'EASY', color: '#2ecc71' },
    { id: 'subtraction', name: 'SUBTRACTION', difficulty: 'MEDIUM', color: '#f39c12' },
    { id: 'multiplication', name: 'MULTIPLICATION', difficulty: 'HARD', color: '#e74c3c' },
    { id: 'division', name: 'DIVISION', difficulty: 'EXTRA HARD', color: '#9b59b6' },
  ];

  return (
    <View style={styles.container}>
      
      {/* MATCHING TITLE STYLE */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>SELECT</Text>
        <Text style={styles.subtitle}>BATTLE</Text>
      </View>
      
      <View style={styles.cardContainer}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.card, { borderColor: cat.color }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onSelectCategory(cat.id);
            }}
          >
            <View style={[styles.difficultyBadge, { backgroundColor: cat.color }]}>
              <Text style={styles.difficultyText}>{cat.difficulty}</Text>
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#2c3e50', // <--- MATCHES MENU SCREEN BACKGROUND
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20,
    width: '100%', 
    height: '100%',
  },
  titleBox: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 26,
    color: '#f1c40f', // <--- MATCHES MENU SCREEN GOLD
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -5,
  },
  cardContainer: {
    width: '100%', 
    gap: 20, 
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#34495e', // Lighter slate blue to stand out from background
    padding: 20, 
    borderRadius: 15, 
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 6, // <--- MATCHES CHUNKY BUTTON STYLE
    alignItems: 'center', 
    position: 'relative',
  },
  difficultyBadge: {
    position: 'absolute', 
    top: -15, 
    paddingHorizontal: 15, 
    paddingVertical: 5,
    borderRadius: 20, 
    borderWidth: 3, 
    borderColor: '#2c3e50', // Seamless integration with background
  },
  difficultyText: {
    color: 'white', fontWeight: 'bold', fontSize: 12, letterSpacing: 1,
  },
  categoryName: {
    color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 5,
  },
  backBtn: {
    padding: 15,
  },
  backBtnText: {
    color: '#7f8c8d', fontSize: 16, fontWeight: 'bold',
  }
});

export default CategoryScreen;