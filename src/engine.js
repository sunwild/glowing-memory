export class Engine {
  constructor({ gravity = { x: 0, y: -9.8, z: 0 } } = {}) {
    this.gravity = gravity;
    this.objects = [];
    this.physicsWorld = null;

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
    const AmmoLib = await Ammo();
    const collisionConfiguration = new AmmoLib.btDefaultCollisionConfiguration();
    const dispatcher = new AmmoLib.btCollisionDispatcher(collisionConfiguration);
    const broadphase = new AmmoLib.btDbvtBroadphase();
    const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration
    );
    this.physicsWorld.setGravity(
      new AmmoLib.btVector3(this.gravity.x, this.gravity.y, this.gravity.z)
    );
    this.Ammo = AmmoLib;

    this._clock = new THREE.Clock();
  }

  addBox({ width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, mass = 1 }) {
    const material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const transform = new this.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new this.Ammo.btVector3(x, y, z));
    const motionState = new this.Ammo.btDefaultMotionState(transform);
    const localInertia = new this.Ammo.btVector3(0, 0, 0);
    const shape = new this.Ammo.btBoxShape(
      new this.Ammo.btVector3(width / 2, height / 2, depth / 2)
    );
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    );
    const body = new this.Ammo.btRigidBody(rbInfo);
    this.physicsWorld.addRigidBody(body);

    this.objects.push({ mesh, body });
  }

  stepSimulation(delta) {
    this.physicsWorld.stepSimulation(delta, 10);

    for (const obj of this.objects) {
      const ms = obj.body.getMotionState();
      if (ms) {
        ms.getWorldTransform(this._transformAux1);
        const p = this._transformAux1.getOrigin();
        const q = this._transformAux1.getRotation();
        obj.mesh.position.set(p.x(), p.y(), p.z());
        obj.mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }

  async start() {
    this._transformAux1 = new this.Ammo.btTransform();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = this._clock.getDelta();
      this.stepSimulation(delta);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
