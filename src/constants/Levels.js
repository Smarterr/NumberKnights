import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

export const LEVELS = [
  {
    id: 1,
    name: "Level 1",
    monsterCount: 1,   // How many monsters to beat to win
    monsterHealth: 10, // How much HP they have
    xpReward: 100,     // XP gained for winning 
  },
  {
    id: 2,
    name: "Level 2",
    monsterCount: 2,
    monsterHealth: 10,
    xpReward: 200,
  },
  {
    id: 3,
    name: "Level 3",
    monsterCount: 2,
    monsterHealth: 20,
    xpReward: 350,
  },
  {
    id: 4,
    name: "Level 4",
    monsterCount: 1,   // How many monsters to beat to win
    monsterHealth: 10, // How much HP they have
    xpReward: 100,     // XP gained for winning 
  },
  {
    id: 5,
    name: "Level 5",
    monsterCount: 2,
    monsterHealth: 10,
    xpReward: 200,
  },
  {
    id: 6,
    name: "Level 6",
    monsterCount: 2,
    monsterHealth: 20,
    xpReward: 350,
  },
];