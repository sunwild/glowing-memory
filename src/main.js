import { Engine } from './engine.js';

async function init() {
  const engine = new Engine();
  await engine.initPhysics();

  // ground plane
  engine.addBox({ width: 20, height: 1, depth: 20, y: -0.5, mass: 0 });

  // falling boxes
  for (let i = 0; i < 5; i++) {
    engine.addBox({ x: Math.random() * 4 - 2, y: 2 + i * 2, z: 0 });
  }

  engine.start();
}

init();
