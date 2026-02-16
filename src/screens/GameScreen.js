import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import ScrollingBackground from '../components/ScrollingBackground';
import Sprite from '../components/Sprite';
import BattleLoop from '../systems/BattleLoop';

const CHAR_SHEET = require('../../assets/roguelikeChar_transparent.png');
const BG_IMAGE = require('../../assets/ScrollingBackground.png'); 

const { width } = Dimensions.get("window");

const GameScreen = ({ levelData, onWin, onExit }) => {
  const engineRef = useRef(null);
  const [score, setScore] = useState(0);
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
      // FIX: Shorter distance
      position: { x: width + 200, y: 316 }, 
      health: 30,     // <--- CHANGED TO 30
      maxHealth: 30,  // <--- CHANGED TO 30
      renderer: <Sprite row={6} col={0} source={CHAR_SHEET} scale={6} /> 
    },
  };

  const handleAnswer = (userAns) => {
    if (userAns === answer) {
      if (engineRef.current) {
        engineRef.current.dispatch({ type: "hit" });
      }
      setScore(score + 10);
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      setQuestion(`${a} + ${b}`);
      setAnswer(a + b);
    } else {
      console.log("Miss!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.battleStage}>
        <GameEngine
          ref={engineRef}
          systems={[BattleLoop]} 
          entities={initialEntities}
          renderer={EntityRenderer} 
          style={styles.gameCanvas}
          onEvent={(e) => {
            if (e.type === "monster-killed") {
               console.log("Monster Died!"); 
            }
          }}
        />
        <Text style={styles.battleText}>BATTLE START!</Text>
      </View>

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
  battleText: { 
    position: 'absolute', top: '20%', width: '100%', 
    textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 24,
    textShadowColor: 'black', textShadowRadius: 5,
  },
  controlPanel: { 
    flex: 0.55, backgroundColor: '#333', alignItems: 'center', padding: 20 
  },
  score: { color: 'gold', fontSize: 24, marginBottom: 20 },
  questionBox: { 
    backgroundColor: '#000', padding: 20, borderRadius: 10, width: '80%', marginBottom: 30 
  },
  questionText: { color: 'white', fontSize: 40, textAlign: 'center' },
  keypad: { flexDirection: 'row', gap: 20 },
  button: { 
    backgroundColor: '#e55039', width: 80, height: 80, 
    justifyContent: 'center', alignItems: 'center', borderRadius: 10 
  },
  btnText: { color: 'white', fontSize: 30, fontWeight: 'bold' }
});

export default GameScreen;