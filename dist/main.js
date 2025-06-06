import { Engine } from '../src/engine.js';
import { GameObject, EventBus } from './scripting.js';
const Spawner = GameObject.extend({
    update() {
        if (Math.random() < 0.01) {
            EventBus.emit('spawnSphere', {
                x: Math.random() * 4 - 2,
                y: 8,
                z: 0
            });
        }
    }
});
async function init() {
    const engine = new Engine();
    await engine.initPhysics();
    engine.addBox({ width: 20, height: 1, depth: 20, y: -0.5, mass: 0 });
    for (let i = 0; i < 5; i++) {
        engine.addBox({ x: Math.random() * 4 - 2, y: 2 + i * 2, z: 0 });
    }
    EventBus.on('spawnSphere', ({ x, y, z }) => {
        engine.addSphere({ radius: 0.5, x, y, z });
    });
    const spawner = new Spawner();
    engine.addGameObject(spawner);
    engine.start();
}
init();
