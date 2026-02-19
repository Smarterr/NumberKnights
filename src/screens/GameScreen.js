import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';

import ScrollingBackground from '../components/ScrollingBackground';
import Sprite from '../components/Sprite';
import BattleLoop from '../systems/BattleLoop';
import DamageTextSystem from '../systems/DamageTextSystem';

const KNIGHT_IMAGES = {
  steel: require('../../assets/SteelKnight.png'),
  copper: require('../../assets/CopperKnight.png'),
  iron: require('../../assets/IronKnight.png'),
  silver: require('../../assets/SilverKnight.png'),
  gold: require('../../assets/GoldKnight.png'),
};

const ORC = require('../../assets/Orc.png');
const SKELETON = require('../../assets/Skeleton.png');
const BG_DAY = require('../../assets/ScrollingBackgroundDay.png'); 
const BG_NIGHT = require('../../assets/ScrollingBackgroundNight.png'); 

const { width } = Dimensions.get("window");

const GameScreen = ({ levelId, category, equippedKnight, onWin, onExit }) => {
  const engineRef = useRef(null);
  
  const monsterMaxHp = 20 + (levelId * 5); 
  const totalEnemies = 3 + Math.floor(levelId / 5); 

  const [randomBg] = useState(() => Math.random() > 0.5 ? BG_DAY : BG_NIGHT);
  const [randomEnemy] = useState(() => Math.random() > 0.5 ? ORC : SKELETON);

  // --- REPLACED 'SCORE' WITH 'SESSION XP' ---
  const [sessionXp, setSessionXp] = useState(0); 
  const [playerHp, setPlayerHp] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);

  const currentKnightImage = KNIGHT_IMAGES[equippedKnight] || KNIGHT_IMAGES['steel'];

  const initialEntities = {
    Background: { offset: 0, renderer: <ScrollingBackground source={randomBg} offset={0} /> },
    Knight: { position: { x: 50, y: 310 }, col: 0, row: 3, sheetCols: 9, sheetRows: 4, timer: 0, renderer: <Sprite source={currentKnightImage} size={64} scale={2} /> },
    Monster: { position: { x: width + 200, y: 290 }, health: monsterMaxHp, maxHealth: monsterMaxHp, col: 0, row: 1, sheetCols: 9, sheetRows: 4, timer: 0, renderer: <Sprite source={randomEnemy} size={64} scale={2} /> },
  };

  const generateQuestion = () => {
    let a, b, q, ans;
    const scale = levelId;

    switch(category) {
      case 'addition':
        a = Math.floor(Math.random() * (5 + scale * 3)) + 1;
        b = Math.floor(Math.random() * (5 + scale * 3)) + 1;
        q = `${a} + ${b}`; ans = a + b; break;
      case 'subtraction':
        a = Math.floor(Math.random() * (10 + scale * 3)) + 5;
        b = Math.floor(Math.random() * a); 
        q = `${a} - ${b}`; ans = a - b; break;
      case 'multiplication':
        a = Math.floor(Math.random() * (3 + Math.floor(scale / 2))) + 1;
        b = Math.floor(Math.random() * (3 + Math.floor(scale / 2))) + 1;
        q = `${a} × ${b}`; ans = a * b; break;
      case 'division':
        b = Math.floor(Math.random() * (2 + Math.floor(scale / 2))) + 2; 
        ans = Math.floor(Math.random() * (3 + Math.floor(scale / 2))) + 1;
        a = b * ans; q = `${a} ÷ ${b}`; break;
      default:
        a = 1; b = 1; q = "1 + 1"; ans = 2;
    }
    setQuestion(q); setAnswer(ans);
  };

  useEffect(() => { generateQuestion(); }, []);

  useEffect(() => {
    if (enemiesDefeated >= totalEnemies) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsVictory(true); 
      if (engineRef.current) engineRef.current.stop();
    }
  }, [enemiesDefeated]);

  useEffect(() => {
    if (playerHp <= 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsGameOver(true); 
      if (engineRef.current) engineRef.current.stop();
    }
  }, [playerHp]);

  const handleAnswer = (userAns) => {
    if (isGameOver || isVictory) return;

    if (userAns === answer) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (engineRef.current) engineRef.current.dispatch({ type: "hit", value: 10 }); 
      // Add 10 XP for every correct answer
      setSessionXp(sessionXp + 10);
      generateQuestion();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (engineRef.current) engineRef.current.dispatch({ type: "hurt", value: 1 }); 
      setPlayerHp(prev => prev - 1); 
    }
  };

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
      <View style={styles.battleStage}>
        <View style={styles.hudContainer}>
          <View style={styles.lifeBar}>
             <Text style={styles.hpLabel}>HP</Text>
             {[...Array(3)].map((_, i) => (
                <Text key={i} style={[styles.heartIcon, { opacity: i < playerHp ? 1 : 0.3 }]}>❤️</Text>
             ))}
          </View>
        </View>

        <View style={styles.topCenterContainer}>
          <Text style={styles.levelTitle}>LEVEL {levelId}</Text>
          {renderProgress()}
        </View>

        <GameEngine
          ref={engineRef}
          systems={[DamageTextSystem, BattleLoop]} 
          entities={initialEntities}
          renderer={EntityRenderer} 
          style={styles.gameCanvas}
          onEvent={(e) => {
            if (e.type === "monster-killed") { setEnemiesDefeated(prev => prev + 1); }
          }}
        />
      </View>

      <View style={styles.controlPanel}>
        {/* DISPLAY XP DURING BATTLE */}
        <Text style={styles.xpScoreText}>{sessionXp} XP</Text>
        
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

      <Modal visible={isGameOver} transparent={true} animationType="fade">
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
            <Text style={[styles.overlayTitle, { color: '#e74c3c' }]}>DEFEAT</Text>
            <Text style={styles.overlayScore}>0 XP EARNED</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onExit}>
              <Text style={styles.btnLabel}>RETREAT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isVictory} transparent={true} animationType="fade">
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
            <Text style={[styles.overlayTitle, { color: '#2ecc71' }]}>VICTORY!</Text>
            <Text style={styles.overlayScore}>+{sessionXp} XP GAINED!</Text>
            {/* PASS THE EARNED XP BACK TO APP.TSX */}
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onWin(levelId, sessionXp)}>
              <Text style={styles.btnLabel}>CONTINUE</Text>
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
        position: entity.position, offset: entity.offset, health: entity.health, maxHealth: entity.maxHealth,
        text: entity.text, color: entity.color, life: entity.life, col: entity.col, row: entity.row, sheetCols: entity.sheetCols, sheetRows: entity.sheetRows, key: key
      });
    }
    return null;
  });
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222' },
  battleStage: { flex: 0.45, backgroundColor: '#4a69bd', borderBottomWidth: 4, borderColor: '#000', position: 'relative' },
  gameCanvas: { flex: 1 },
  hudContainer: { position: 'absolute', top: 50, left: 20, zIndex: 100 },
  lifeBar: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  hpLabel: { color: '#bdc3c7', fontWeight: '900', fontSize: 14, marginRight: 10 },
  heartIcon: { fontSize: 18, marginHorizontal: 2 },
  topCenterContainer: { position: 'absolute', top: 50, width: '100%', alignItems: 'center', zIndex: 90 },
  levelTitle: { color: 'white', fontWeight: '900', fontSize: 20, textShadowColor: 'black', textShadowRadius: 3, marginBottom: 8, letterSpacing: 2, fontFamily: 'monospace' },
  progressContainer: { flexDirection: 'row', gap: 10 },
  progressCircle: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: 'white', backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  filledCircle: { backgroundColor: '#f1c40f', borderColor: '#f1c40f' },
  checkMark: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  controlPanel: { flex: 0.55, backgroundColor: '#333', alignItems: 'center', padding: 20 },
  
  // NEW XP TEXT STYLING
  xpScoreText: { color: '#2ecc71', fontSize: 24, marginBottom: 20, fontFamily: 'monospace', fontWeight: 'bold' },
  
  questionBox: { backgroundColor: '#000', padding: 20, borderRadius: 10, width: '80%', marginBottom: 30 },
  questionText: { color: 'white', fontSize: 40, textAlign: 'center' },
  keypad: { flexDirection: 'row', gap: 20 },
  button: { backgroundColor: '#e55039', width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderBottomWidth: 4, borderColor: '#c0392b' },
  btnText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '80%', backgroundColor: '#2c3e50', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  overlayTitle: { fontSize: 36, fontWeight: '900', marginBottom: 10, textAlign: 'center', letterSpacing: 2 },
  overlayScore: { color: '#f1c40f', fontSize: 24, fontWeight: 'bold', marginBottom: 30, fontFamily: 'monospace' },
  primaryBtn: { backgroundColor: '#3498db', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, borderBottomWidth: 4, borderColor: '#2980b9' },
  btnLabel: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});

export default GameScreen;