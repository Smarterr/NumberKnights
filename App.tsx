import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native'; // <--- Removed SafeAreaView

// --- SCREENS ---
import GameScreen from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MenuScreen from './src/screens/MenuScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('menu'); 
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  
  // PROGRESS STATE
  const [highestLevel, setHighestLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);

  // --- NAVIGATION HANDLERS ---
  const handleStartGame = () => {
    setCurrentScreen('levelSelect');
  };

  const handleSelectLevel = (level: any) => {
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  // --- GAME LOGIC ---
  const handleWin = (levelId: number) => {
    setXp(prev => prev + 100);

    if (levelId === highestLevel) {
      setHighestLevel(prev => prev + 1);
    }
    setCurrentScreen('levelSelect');
  };

  const handleExitGame = () => {
    setCurrentScreen('levelSelect');
  };

  // --- RENDER SCREEN ---
  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MenuScreen onStartGame={handleStartGame} />;
      case 'levelSelect':
        return (
          <LevelSelectScreen 
            onSelectLevel={handleSelectLevel} 
            onBack={handleBackToMenu}
            playerLevel={highestLevel} 
            playerXp={xp}
          />
        );
      case 'game':
        return (
          <GameScreen 
            levelData={selectedLevel} 
            onWin={handleWin}   
            onExit={handleExitGame} 
          />
        );
      default:
        return <MenuScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    // FIX: Changed SafeAreaView to standard View to fix the edges
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
});

export default App;
registerRootComponent(App);