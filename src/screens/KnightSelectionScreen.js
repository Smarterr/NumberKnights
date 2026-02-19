import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KnightSelectionScreen = ({ xp, selectedKnight, onEquip, onBack }) => {
  
  // --- DYNAMIC SCALING XP ALGORITHM ---
  let level = 1;
  let xpNeededForNext = 100;
  let remainingXp = xp;

  // We loop through the XP, subtracting the requirement for each level
  // until we don't have enough to level up anymore.
  while (remainingXp >= xpNeededForNext) {
    remainingXp -= xpNeededForNext;
    level++;
    // Multiply the requirement by 1.5x for the next level (100 -> 150 -> 225...)
    xpNeededForNext = Math.floor(xpNeededForNext * 1.5); 
  }

  const playerLevel = level;
  const currentLevelXp = remainingXp;
  // Calculate the percentage for the green visual bar
  const progressPercent = `${Math.floor((currentLevelXp / xpNeededForNext) * 100)}%`;
  const xpRemainingToNext = xpNeededForNext - currentLevelXp;

  const knights = [
    { id: 'steel', name: 'STEEL KNIGHT', reqLevel: 1, color: '#bdc3c7' },
    { id: 'copper', name: 'COPPER KNIGHT', reqLevel: 10, color: '#e67e22' },
    { id: 'iron', name: 'IRON KNIGHT', reqLevel: 20, color: '#7f8c8d' },
    { id: 'silver', name: 'SILVER KNIGHT', reqLevel: 30, color: '#ecf0f1' },
    { id: 'gold', name: 'GOLD KNIGHT', reqLevel: 40, color: '#f1c40f' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonTopLeft} onPress={onBack}>
        <Text style={styles.backArrow}>◀</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>ARMORY</Text>
        
        <View style={styles.statsCard}>
          <View style={styles.levelRow}>
            <Text style={styles.subtitle}>LVL {playerLevel}</Text>
            <Text style={styles.xpText}>TOTAL: {xp} XP</Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: progressPercent }]} />
          </View>
          {/* UPDATED: Accurately shows the scaling remaining XP */}
          <Text style={styles.nextLevelText}>Next level in {xpRemainingToNext} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {knights.map((knight) => {
          const isUnlocked = playerLevel >= knight.reqLevel;
          const isEquipped = selectedKnight === knight.id;

          return (
            <TouchableOpacity
              key={knight.id}
              style={[
                styles.card, 
                isEquipped ? styles.equippedCard : (isUnlocked ? styles.unlockedCard : styles.lockedCard)
              ]}
              disabled={!isUnlocked || isEquipped}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onEquip(knight.id);
              }}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={[
                    styles.knightName, 
                    { color: isEquipped ? 'white' : (isUnlocked ? knight.color : '#556b82') }
                  ]}>
                    {knight.name}
                  </Text>
                  
                  {!isUnlocked ? (
                    <Text style={styles.reqText}>Unlocks at Level {knight.reqLevel}</Text>
                  ) : isEquipped ? (
                    <Text style={styles.equippedText}>ACTIVE</Text>
                  ) : (
                    <Text style={styles.tapText}>Tap to Equip</Text>
                  )}
                </View>

                <View style={styles.iconBox}>
                  {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
                  {isEquipped && <Text style={styles.checkIcon}>✨</Text>}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', alignItems: 'center', paddingTop: 60 },
  backButtonTopLeft: {
    position: 'absolute', top: 55, left: 20, width: 44, height: 44, backgroundColor: '#34495e', 
    borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 4, borderColor: '#1a252f', zIndex: 10,
  },
  backArrow: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: -3 },
  
  header: { alignItems: 'center', width: '100%', marginBottom: 20 },
  title: { color: 'white', fontSize: 36, fontWeight: '900', letterSpacing: 3, marginBottom: 15 },
  
  statsCard: { backgroundColor: 'rgba(0,0,0,0.3)', width: '85%', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#34495e' },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtitle: { color: '#f1c40f', fontSize: 20, fontWeight: '900' },
  xpText: { color: '#bdc3c7', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  progressBarBg: { width: '100%', height: 12, backgroundColor: '#111', borderRadius: 6, marginVertical: 8, overflow: 'hidden', borderWidth: 2, borderColor: '#222' },
  progressBarFill: { height: '100%', backgroundColor: '#2ecc71' },
  nextLevelText: { color: '#7f8c8d', fontSize: 12, textAlign: 'right', fontStyle: 'italic' },

  list: { width: '100%', paddingHorizontal: 20, paddingBottom: 40, gap: 15 },
  
  card: { padding: 20, borderRadius: 15, borderBottomWidth: 6, width: '100%' },
  equippedCard: { backgroundColor: '#27ae60', borderColor: '#1e8449' }, 
  unlockedCard: { backgroundColor: '#34495e', borderColor: '#22313f' }, 
  lockedCard: { backgroundColor: '#1a252f', borderColor: '#11181f', opacity: 0.8 }, 
  
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  knightName: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  
  reqText: { color: '#e74c3c', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  equippedText: { color: '#a8e6cf', fontSize: 14, fontWeight: '900', marginTop: 5, letterSpacing: 1 },
  tapText: { color: '#95a5a6', fontSize: 14, marginTop: 5, fontWeight: 'bold' },
  
  iconBox: { justifyContent: 'center', alignItems: 'center', width: 40 },
  lockIcon: { fontSize: 22 },
  checkIcon: { fontSize: 24 },
});

export default KnightSelectionScreen;