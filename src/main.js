import { Engine } from './engine.js';
import { Input } from './input.js';
import { CameraRig } from './cameraRig.js';

async function init() {
  const engine = new Engine();
  await engine.initPhysics();

  Input.bind('moveForward', ['KeyW', 'ArrowUp']);
  Input.bind('moveBackward', ['KeyS', 'ArrowDown']);
  Input.bind('moveLeft', ['KeyA', 'ArrowLeft']);
  Input.bind('moveRight', ['KeyD', 'ArrowRight']);
  Input.bind('lookX', ['MouseMoveX', 'AXIS2'], 0.002);
  Input.bind('lookY', ['MouseMoveY', 'AXIS3'], 0.002);

  const player = new THREE.Object3D();
  engine.scene.add(player);
  const cameraRig = new CameraRig(engine.camera, player);
  cameraRig.setMode('TPS');
  const speed = 5;
  engine.addUpdateCallback((delta) => {
    Input.update();
    const dir = new THREE.Vector3();
    if (Input.get('moveForward')) dir.z -= 1;
    if (Input.get('moveBackward')) dir.z += 1;
    if (Input.get('moveLeft')) dir.x -= 1;
    if (Input.get('moveRight')) dir.x += 1;
    if (dir.lengthSq() > 0) {
      dir.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRig.yaw);
      player.position.addScaledVector(dir, speed * delta);
    }
    cameraRig.update();
  });

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
}

init();
