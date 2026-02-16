import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const BattleLoop = (entities, { events, dispatch }) => {
  const monster = entities.Monster;
  const bg = entities.Background;

  if (events && events.length) {
    events.forEach(e => {
      if (e.type === "hit" && monster) {
        
        // 1. DAMAGE: Subtract 10 instead of 1
        monster.health -= 10; 

        // 2. CHECK DEATH
        if (monster.health <= 0) {
          monster.health = monster.maxHealth;
          monster.position.x = width + 200; 
          dispatch({ type: "monster-killed" });
        }
      }
    });
  }

  // MOVEMENT LOGIC (Same as before)
  const stopPoint = width - 100; 
  const isWalking = monster && monster.position.x > stopPoint;

  if (isWalking) {
    monster.position.x -= 3; 
    if (bg) { bg.offset -= 2; }
  }

  return entities;
};

export default BattleLoop;