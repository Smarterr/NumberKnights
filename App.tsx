import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

// --- SCREENS ---
import CategoryScreen from './src/screens/CategoryScreen'; // <--- NEW IMPORT
import GameScreen from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MenuScreen from './src/screens/MenuScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('menu'); 
  
  // --- NEW PROGRESS STATE ---
  // We now track the highest unlocked level for EACH category independently!
  const [progress, setProgress] = useState<any>({
    addition: 1,
    subtraction: 1,
    multiplication: 1,
    division: 1,
  });
  
  const [xp, setXp] = useState<number>(0);

  // --- CURRENT GAME CHOICES ---
  const [selectedCategory, setSelectedCategory] = useState<string>('addition');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // --- NAVIGATION HANDLERS ---
  const handleStartGame = () => {
    setCurrentScreen('categories'); // Go to categories first
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentScreen('levelSelect'); // Then to levels
  };

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setCurrentScreen('game'); // Then to the game
  };

  const handleBackToMenu = () => setCurrentScreen('menu');
  const handleBackToCategories = () => setCurrentScreen('categories');
  const handleExitGame = () => setCurrentScreen('levelSelect');

  // --- GAME LOGIC ---
  const handleWin = (wonLevelId: number) => {
    setXp(prev => prev + 100);

    // If they beat the highest level they have unlocked IN THIS CATEGORY, unlock the next one!
    if (wonLevelId === progress[selectedCategory]) {
      setProgress((prev: any) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory] + 1
      }));
    }
    setCurrentScreen('levelSelect');
  };

  // --- RENDER SCREEN ---
  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MenuScreen onStartGame={handleStartGame} />;
      
      case 'categories':
        return (
          <CategoryScreen 
            onSelectCategory={handleSelectCategory} 
            onBack={handleBackToMenu} 
          />
        );

      case 'levelSelect':
        return (
          <LevelSelectScreen 
            // We pass the specific progress for the chosen category
            playerLevel={progress[selectedCategory]} 
            selectedCategory={selectedCategory}
            onSelectLevel={handleSelectLevel} 
            onBack={handleBackToCategories}
          />
        );

      case 'game':
        return (
          <GameScreen 
            levelId={selectedLevelId} 
            category={selectedCategory} 
            onWin={handleWin}   
            onExit={handleExitGame} 
          />
        );

      default:
        return <MenuScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50' },
});

export default App;
registerRootComponent(App);