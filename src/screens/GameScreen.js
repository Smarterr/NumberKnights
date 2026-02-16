import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import ScrollingBackground from '../components/ScrollingBackground';
import Sprite from '../components/Sprite';
import BattleLoop from '../systems/BattleLoop';

// --- ASSETS ---
const CHAR_SHEET = require('../../assets/roguelikeChar_transparent.png');
const BG_IMAGE = require('../../assets/ScrollingBackground.png'); 

const { width } = Dimensions.get("window");

const GameScreen = ({ levelData, onWin, onExit }) => {
  const engineRef = useRef(null);
  
  // --- READ LEVEL DATA ---
  // If no level data is passed, default to Level 1 settings
  const currentLevelId = levelData ? levelData.id : 1;
  const totalEnemies = levelData ? levelData.monsterCount : 3;
  const monsterMaxHp = levelData ? levelData.monsterHealth : 20;

  // --- GAME STATE ---
  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);

  // --- QUIZ STATE ---
  const [question, setQuestion] = useState("5 + 3");
  const [answer, setAnswer] = useState(8);

  const initialEntities = {
    Background: { 
      offset: 0, 
      renderer: <ScrollingBackground source={BG_IMAGE} offset={0} /> 
    },
    Knight: { 
      position: { x: 50, y: 340 }, 
      renderer: <Sprite row={11} col={0} source={CHAR_SHEET} scale={6} /> 
    },
    Monster: { 
      position: { x: width + 200, y: 316 }, 
      health: monsterMaxHp,     // <--- Uses Level Data
      maxHealth: monsterMaxHp,  // <--- Uses Level Data
      renderer: <Sprite row={6} col={0} source={CHAR_SHEET} scale={6} /> 
    },
  };

  // --- CHECK WIN CONDITION ---
  useEffect(() => {
    // If we have defeated enough enemies, trigger victory
    if (enemiesDefeated >= totalEnemies) {
      setIsVictory(true); 
      if (engineRef.current) engineRef.current.stop();
    }
  }, [enemiesDefeated]);

  // --- CHECK LOSS CONDITION ---
  useEffect(() => {
    if (playerHp <= 0) {
      setIsGameOver(true); 
      if (engineRef.current) engineRef.current.stop();
    }
  }, [playerHp]);

  const handleAnswer = (userAns) => {
    if (isGameOver || isVictory) return;

    if (userAns === answer) {
      // CORRECT ANSWER
      if (engineRef.current) engineRef.current.dispatch({ type: "hit" });
      setScore(score + 10);
      generateQuestion();
    } else {
      // WRONG ANSWER
      setPlayerHp(prev => prev - 1); 
    }
  };

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setQuestion(`${a} + ${b}`);
    setAnswer(a + b);
  };

  // --- RENDER PROGRESS CIRCLES ---
  const renderProgress = () => {
    let circles = [];
    for (let i = 0; i < totalEnemies; i++) {
      const isFilled = i < enemiesDefeated;
      circles.push(
        <View key={i} style={[styles.progressCircle, isFilled && styles.filledCircle]}>
          {isFilled && <Text style={styles.checkMark}>✓</Text>}
        </View>
      );
    }
    return <View style={styles.progressContainer}>{circles}</View>;
  };

  return (
    <View style={styles.container}>
      
      {/* --- BATTLE STAGE --- */}
      <View style={styles.battleStage}>
        
        {/* PLAYER HP (Top Left) */}
        <View style={styles.hudContainer}>
          <View style={styles.lifeBar}>
             <Text style={styles.hpLabel}>HP</Text>
             {[...Array(3)].map((_, i) => (
                <Text key={i} style={[styles.heartIcon, { opacity: i < playerHp ? 1 : 0.3 }]}>
                  ❤️
                </Text>
             ))}
          </View>
        </View>

        {/* CENTER INFO (Level Title + Circles) */}
        <View style={styles.topCenterContainer}>
          <Text style={styles.levelTitle}>LEVEL {currentLevelId}</Text>
          {renderProgress()}
        </View>

        <GameEngine
          ref={engineRef}
          systems={[BattleLoop]} 
          entities={initialEntities}
          renderer={EntityRenderer} 
          style={styles.gameCanvas}
          onEvent={(e) => {
            if (e.type === "monster-killed") {
               // Increment kill count
               setEnemiesDefeated(prev => prev + 1);
               
               // Logic to STOP spawning if we just won happens in BattleLoop or via state check,
               // but visually the user sees the Victory screen immediately due to useEffect.
            }
          }}
        />
      </View>

      {/* --- CONTROLS --- */}
      <View style={styles.controlPanel}>
        <Text style={styles.score}>Score: {score}</Text>
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{question} = ?</Text>
        </View>
        <View style={styles.keypad}>
          {[answer, answer+1, answer-1].sort(()=> Math.random()-0.5).map((val, i) => (
            <TouchableOpacity key={i} style={styles.button} onPress={() => handleAnswer(val)}>
              <Text style={styles.btnText}>{val}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- GAME OVER MODAL --- */}
      <Modal visible={isGameOver} transparent={true} animationType="fade">
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
            <Text style={[styles.overlayTitle, { color: '#e74c3c' }]}>GAME OVER</Text>
            <Text style={styles.overlayScore}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onExit}>
              <Text style={styles.btnLabel}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- VICTORY MODAL --- */}
      <Modal visible={isVictory} transparent={true} animationType="fade">
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
            <Text style={[styles.overlayTitle, { color: '#f1c40f' }]}>VICTORY!</Text>
            <Text style={styles.overlayScore}>Total Score: {score}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onWin(currentLevelId)}>
              <Text style={styles.btnLabel}>NEXT LEVEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const EntityRenderer = (state, screen) => {
  if (!state) return null;
  return Object.keys(state).map(key => {
    const entity = state[key];
    if (entity.renderer) {
      return React.cloneElement(entity.renderer, {
        position: entity.position,
        offset: entity.offset, 
        health: entity.health,
        maxHealth: entity.maxHealth,
        key: key
      });
    }
    return null;
  });
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222' },
  battleStage: { 
    flex: 0.45, 
    backgroundColor: '#4a69bd', 
    borderBottomWidth: 4,
    borderColor: '#000',
    position: 'relative', 
  },
  gameCanvas: { flex: 1 },

  // --- HUD ---
  hudContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
  },
  lifeBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hpLabel: {
    color: '#bdc3c7', fontWeight: '900', fontSize: 14, marginRight: 10,
  },
  heartIcon: { fontSize: 18, marginHorizontal: 2 },

  // --- CENTER PROGRESS (Circles under Text) ---
  topCenterContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center', // This centers the column
    zIndex: 90,
  },
  levelTitle: {
    color: 'white', fontWeight: '900', fontSize: 20,
    textShadowColor: 'black', textShadowRadius: 3,
    marginBottom: 8, // Adds space between Text and Circles
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  progressContainer: { flexDirection: 'row', gap: 10 },
  progressCircle: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 2, borderColor: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  filledCircle: { backgroundColor: '#f1c40f', borderColor: '#f1c40f' },
  checkMark: { color: '#000', fontSize: 10, fontWeight: 'bold' },

  // --- CONTROLS ---
  controlPanel: { flex: 0.55, backgroundColor: '#333', alignItems: 'center', padding: 20 },
  score: { color: 'gold', fontSize: 24, marginBottom: 20, fontFamily: 'monospace' },
  questionBox: { backgroundColor: '#000', padding: 20, borderRadius: 10, width: '80%', marginBottom: 30 },
  questionText: { color: 'white', fontSize: 40, textAlign: 'center' },
  keypad: { flexDirection: 'row', gap: 20 },
  button: { 
    backgroundColor: '#e55039', width: 80, height: 80, 
    justifyContent: 'center', alignItems: 'center', borderRadius: 10,
    borderBottomWidth: 4, borderColor: '#c0392b' 
  },
  btnText: { color: 'white', fontSize: 30, fontWeight: 'bold' },

  // --- OVERLAYS ---
  overlayContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', alignItems: 'center',
  },
  card: {
    width: '80%', backgroundColor: '#2c3e50', padding: 30, borderRadius: 20,
    alignItems: 'center', borderWidth: 2, borderColor: 'white',
  },
  overlayTitle: { fontSize: 32, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  overlayScore: { color: '#bdc3c7', fontSize: 20, marginBottom: 30, fontFamily: 'monospace' },
  primaryBtn: {
    backgroundColor: '#3498db', paddingVertical: 15, paddingHorizontal: 40,
    borderRadius: 30, borderBottomWidth: 4, borderColor: '#2980b9',
  },
  btnLabel: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});

export default GameScreen;