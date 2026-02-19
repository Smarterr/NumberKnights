import FloatingText from '../components/FloatingText';

let textIdCounter = 0; // Gives each floating number a unique ID

const DamageTextSystem = (entities, { events }) => {
  // 1. SPAWN NEW TEXT ON EVENTS
  if (events.length > 0) {
    events.forEach(e => {
      // Monster takes damage
      if (e.type === "hit" && entities.Monster) {
        const id = `dmg_${textIdCounter++}`;
        entities[id] = {
          position: { x: entities.Monster.position.x + 20, y: entities.Monster.position.y - 20 },
          text: `-${e.value || 10}`,
          color: '#f1c40f', // Gold/Yellow for monster hits
          life: 100,
          isDamageText: true,
          renderer: <FloatingText />
        };
      }

      // Player takes damage (Wrong Answer)
      if (e.type === "hurt" && entities.Knight) {
        const id = `dmg_${textIdCounter++}`;
        entities[id] = {
          position: { x: entities.Knight.position.x + 20, y: entities.Knight.position.y - 20 },
          text: `-${e.value || 1}`,
          color: '#e74c3c', // Red for player damage
          life: 100,
          isDamageText: true,
          renderer: <FloatingText />
        };
      }
    });
  }

  // 2. ANIMATE EXISTING TEXT
  Object.keys(entities).forEach(key => {
    let entity = entities[key];
    
    if (entity.isDamageText) {
      entity.position.y -= 1.5; // Float upwards 1.5 pixels per frame
      entity.life -= 3;         // Fade out speed (higher = faster fade)

      // Clean up the entity so it doesn't cause memory leaks
      if (entity.life <= 0) {
        delete entities[key];
      }
    }
  });

  return entities;
};

export default DamageTextSystem;