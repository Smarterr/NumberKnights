import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import CategoryScreen from './src/screens/CategoryScreen';
import GameScreen from './src/screens/GameScreen';
import KnightSelectionScreen from './src/screens/KnightSelectionScreen'; // <--- NEW
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MenuScreen from './src/screens/MenuScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('menu'); 
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // --- MASTER SAVE STATE ---
  const [saveData, setSaveData] = useState<any>({
    progress: { addition: 1, subtraction: 1, multiplication: 1, division: 1 },
    xp: 0,
    equippedKnight: 'steel'
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('addition');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  // --- LOAD SAVED DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('@number_knights_save');
        if (data !== null) {
          // Merge saved data with defaults in case of updates
          setSaveData((prev: any) => ({ ...prev, ...JSON.parse(data) }));
        }
      } catch (e) {
        console.log("Failed to load save data.", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // --- SAVE DATA WHENEVER IT CHANGES ---
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('@number_knights_save', JSON.stringify(saveData)).catch(e => console.log(e));
    }
  }, [saveData, isLoaded]);

  // --- NAVIGATION ---
  const handleStartGame = () => setCurrentScreen('categories');
  const handleSelectKnightMenu = () => setCurrentScreen('knightSelection');
  const handleSelectCategory = (categoryId: string) => { setSelectedCategory(categoryId); setCurrentScreen('levelSelect'); };
  const handleSelectLevel = (levelId: number) => { setSelectedLevelId(levelId); setCurrentScreen('game'); };
  const handleBackToMenu = () => setCurrentScreen('menu');
  const handleBackToCategories = () => setCurrentScreen('categories');
  const handleExitGame = () => setCurrentScreen('levelSelect');

  // --- EQUIPPING KNIGHT ---
  const handleEquipKnight = (knightId: string) => {
    setSaveData((prev: any) => ({ ...prev, equippedKnight: knightId }));
  };

  // --- GAME LOGIC ---
  const handleWin = (wonLevelId: number, earnedXp: number) => {
    setSaveData((prev: any) => {
      const newProgress = { ...prev.progress };
      if (wonLevelId === newProgress[selectedCategory]) {
        newProgress[selectedCategory] += 1;
      }
      return {
        ...prev,
        xp: prev.xp + earnedXp, // <--- Add the exact XP earned in battle
        progress: newProgress
      };
    });
    setCurrentScreen('levelSelect');
  };

  const renderScreen = () => {
    if (!isLoaded) return <View style={styles.container}><Text style={{color:'white', marginTop:100}}>Loading...</Text></View>;

    switch (currentScreen) {
      case 'menu': return <MenuScreen onStartGame={handleStartGame} onSelectKnight={handleSelectKnightMenu} />;
      case 'knightSelection': return <KnightSelectionScreen xp={saveData.xp} selectedKnight={saveData.equippedKnight} onEquip={handleEquipKnight} onBack={handleBackToMenu} />;
      case 'categories': return <CategoryScreen onSelectCategory={handleSelectCategory} onBack={handleBackToMenu} />;
      case 'levelSelect': return <LevelSelectScreen playerLevel={saveData.progress[selectedCategory]} selectedCategory={selectedCategory} onSelectLevel={handleSelectLevel} onBack={handleBackToCategories} />;
      case 'game': return <GameScreen levelId={selectedLevelId} category={selectedCategory} equippedKnight={saveData.equippedKnight} onWin={handleWin} onExit={handleExitGame} />;
      default: return <MenuScreen onStartGame={handleStartGame} onSelectKnight={handleSelectKnightMenu} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#2c3e50' } });
export default App;
registerRootComponent(App);