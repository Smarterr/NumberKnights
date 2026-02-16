import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

export const LEVELS = [
  {
    id: 1,
    difficulty: 10,
    xpReward: 50, // <--- NEW: 50 XP for easy level
    monsters: [
      { id: 'Monster1', pos: [width - 100, 100], color: 'red' },
      { id: 'Monster2', pos: [width - 100, 300], color: 'green' },
      { id: 'Monster3', pos: [width - 250, 200], color: 'purple' },
    ]
  },
  {
    id: 2,
    difficulty: 20,
    xpReward: 100, // <--- NEW: 100 XP for medium level
    monsters: [
      { id: 'M1', pos: [width - 80, 80], color: 'orange' },
      { id: 'M2', pos: [width - 80, height - 100], color: 'blue' },
      { id: 'M3', pos: [width - 200, height / 2], color: 'pink' },
      { id: 'M4', pos: [width - 300, 100], color: 'red' }, 
    ]
  },
  {
    id: 3,
    difficulty: 50,
    xpReward: 200, // <--- NEW: Big reward!
    monsters: [
      { id: 'M1', pos: [width - 50, 50], color: 'black' },
      { id: 'M2', pos: [width - 50, 150], color: 'black' },
      { id: 'M3', pos: [width - 50, 250], color: 'black' },
      { id: 'M4', pos: [width - 50, 350], color: 'black' },
      { id: 'M5', pos: [width - 200, 200], color: 'red' },
    ]
  }
];