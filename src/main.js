import { Engine } from './engine.js';
import { UIManager } from './ui/uiManager.js';

async function init() {
  const engine = new Engine();
  await engine.initPhysics();
  const ui = new UIManager(engine.scene);

  // ground plane
  engine.addBox({ width: 20, height: 1, depth: 20, y: -0.5, mass: 0 });

  // falling boxes
  for (let i = 0; i < 5; i++) {
    engine.addBox({ x: Math.random() * 4 - 2, y: 2 + i * 2, z: 0 });
  }

  // falling spheres
  for (let i = 0; i < 3; i++) {
    engine.addSphere({
      radius: 0.5,
      x: Math.random() * 4 - 2,
      y: 6 + i * 2,
      z: 0,
    });
  }

  ui.show('inventory', { items: ['Sword', 'Shield'] });
  ui.show('minimap');
  ui.show('dialog', { message: 'Welcome to the demo!' });

  ui.widgets.dialog.el.addEventListener('close', () => ui.widgets.dialog.hide());

  engine.start();
}

init();
