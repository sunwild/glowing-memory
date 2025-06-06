import { PhysicsWorld } from './physics.js';

export class Engine {
  constructor({ gravity = { x: 0, y: -9.8, z: 0 } } = {}) {
    this.gravity = gravity;
    this.physics = new PhysicsWorld({ gravity });
    this.objects = [];

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  async initPhysics() {
    await this.physics.init();
    this._clock = new THREE.Clock();
  }

  addBox({ width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, mass = 1 }) {
    const material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const body = this.physics.addBody(mesh, {
      shape: 'box',
      size: [width, height, depth],
      mass,
    });
    this.objects.push({ mesh, body });
  }

  addSphere({ radius = 1, x = 0, y = 0, z = 0, mass = 1 }) {
    const material = new THREE.MeshStandardMaterial({ color: 0xff9966 });
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const body = this.physics.addBody(mesh, {
      shape: 'sphere',
      radius,
      mass,
    });
    this.objects.push({ mesh, body });
  }

  stepSimulation(delta) {
    this.physics.step(delta);
  }

  async start() {
    this._transformAux1 = new this.physics.Ammo.btTransform();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = this._clock.getDelta();
      this.stepSimulation(delta);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
