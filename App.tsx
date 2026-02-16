import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import GameScreen from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MenuScreen from './src/screens/MenuScreen';

type LevelData = {
  id: number;
  difficulty: number;
  xpReward: number; // <--- Added type definition
  monsters: any[];
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('menu'); 
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(1);
  const [selectedLevelData, setSelectedLevelData] = useState<LevelData | null>(null);

  // --- NEW XP SYSTEM ---
  const [totalXp, setTotalXp] = useState<number>(0);
  
  // Calculate Level: (XP / 100) rounded down, plus 1.
  // Example: 250 XP = Level 3
  const playerLevel = Math.floor(totalXp / 100) + 1;

  // --- NAVIGATION ---
  const goMenu = () => setCurrentScreen('menu');
  const goLevels = () => setCurrentScreen('levels');
  
  const startGame = (levelData: any) => {
    setSelectedLevelData(levelData);
    setCurrentScreen('game');
  };

  const handleLevelComplete = (completedLevelId: number) => {
    // 1. Give XP!
    if (selectedLevelData) {
      setTotalXp(prev => prev + selectedLevelData.xpReward);
    }

    // 2. Unlock Next Level
    if (completedLevelId >= maxUnlockedLevel) {
      setMaxUnlockedLevel(completedLevelId + 1);
    }
    goLevels(); 
  };

  // --- RENDER ---
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {currentScreen === 'menu' && (
        // @ts-ignore
        <MenuScreen onPlay={goLevels} />
      )}

      {currentScreen === 'levels' && (
        <LevelSelectScreen 
          unlockedLevels={maxUnlockedLevel} 
          // @ts-ignore
          onSelectLevel={startGame}
          onBack={goMenu}
          playerLevel={playerLevel} // <--- Pass Level
          playerXp={totalXp}        // <--- Pass XP
        />
      )}

      {currentScreen === 'game' && selectedLevelData && (
        <GameScreen 
          levelData={selectedLevelData} 
          // @ts-ignore
          onWin={handleLevelComplete}
          onExit={goLevels}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});

registerRootComponent(App);