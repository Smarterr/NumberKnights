import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const BattleLoop = (entities, { events, dispatch, time }) => {
  const monster = entities.Monster;
  const knight = entities.Knight;
  const bg = entities.Background;

  // --- 1. HANDLE HITS (Game Logic) ---
  if (events && events.length) {
    events.forEach(e => {
      if (e.type === "hit" && monster) {
        monster.health -= 10; 
        if (monster.health <= 0) {
          monster.health = monster.maxHealth;
          monster.position.x = width + 200; 
          dispatch({ type: "monster-killed" });
        }
      }
    });
  }

  // --- 2. CHECK GAME STATE ---
  // If monster is far away (> 100px from right), we are WALKING.
  // If monster is close, we are FIGHTING (Stopped).
  const stopPoint = width - 100; 
  const isWalking = monster && monster.position.x > stopPoint;

  if (isWalking) {
    // === STATE: WALKING (Everything Moves) ===
    
    // A. Move the World
    monster.position.x -= 3; 
    if (bg) { bg.offset -= 2; }

    // B. Animate Knight (Running)
    if (knight) {
      knight.timer = (knight.timer || 0) + time.delta;
      if (knight.timer > 100) { 
        knight.timer = 0;
        knight.col = (knight.col + 1) % knight.sheetCols;
      }
    }

    // C. Animate Monster (Walking)
    if (monster) {
      monster.timer = (monster.timer || 0) + time.delta;
      if (monster.timer > 100) { 
        monster.timer = 0;
        monster.col = (monster.col + 1) % monster.sheetCols;
      }
    }

  } else {
    // === STATE: FIGHTING (Everything Stops) ===
    
    // Reset characters to "Standing Frame" (Column 0)
    // This ensures they don't freeze with one leg in the air!
    if (knight) knight.col = 0; 
    if (monster) monster.col = 0;
  }

  return entities;
};

export default BattleLoop;