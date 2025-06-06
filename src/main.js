import { Engine } from './engine.js';
import { Editor } from './editor.js';
import { Profiler } from './profiler.js';

async function init() {
  const engine = new Engine();
  await engine.initPhysics();

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

  engine.start();

  const editor = new Editor(engine);
  engine.editor = editor;
  await editor.open();

  const profiler = new Profiler(engine.renderer);
  profiler.capture(1000).then((r) => console.log('Profile:', r));
}

init();
