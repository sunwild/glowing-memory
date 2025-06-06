export class PhysicsWorld {
  constructor({ gravity = { x: 0, y: -9.8, z: 0 } } = {}) {
    this.gravity = gravity;
    this.world = null;
    this.objects = new Map();
    this.constraints = [];
    this.Ammo = null;
    this._transform = null;
    this._clock = null;
  }

  async init() {
    const AmmoLib = await Ammo();
    this.Ammo = AmmoLib;
    const config = new AmmoLib.btDefaultCollisionConfiguration();
    const dispatcher = new AmmoLib.btCollisionDispatcher(config);
    const broadphase = new AmmoLib.btDbvtBroadphase();
    const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
    this.world = new AmmoLib.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      config
    );
    this.world.setGravity(
      new AmmoLib.btVector3(this.gravity.x, this.gravity.y, this.gravity.z)
    );
    this._transform = new AmmoLib.btTransform();
    this._clock = new THREE.Clock();
  }

  addBody(node, {
    shape = 'box',
    size = [1, 1, 1],
    radius = 1,
    mass = 1,
    friction = 0.5,
    restitution = 0,
  } = {}) {
    const AmmoLib = this.Ammo;
    let ammoShape;
    if (shape === 'box') {
      ammoShape = new AmmoLib.btBoxShape(
        new AmmoLib.btVector3(size[0] / 2, size[1] / 2, size[2] / 2)
      );
    } else if (shape === 'sphere') {
      ammoShape = new AmmoLib.btSphereShape(radius);
    } else {
      throw new Error('Unknown shape');
    }

    const transform = new AmmoLib.btTransform();
    transform.setIdentity();
    transform.setOrigin(
      new AmmoLib.btVector3(node.position.x, node.position.y, node.position.z)
    );
    const motionState = new AmmoLib.btDefaultMotionState(transform);
    const localInertia = new AmmoLib.btVector3(0, 0, 0);
    ammoShape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(
      mass,
      motionState,
      ammoShape,
      localInertia
    );
    const body = new AmmoLib.btRigidBody(rbInfo);
    body.setFriction(friction);
    body.setRestitution(restitution);
    this.world.addRigidBody(body);

    this.objects.set(node, body);
    return body;
  }

  addPointToPointConstraint(bodyA, bodyB, pivotA, pivotB) {
    const AmmoLib = this.Ammo;
    const pA = new AmmoLib.btVector3(pivotA.x, pivotA.y, pivotA.z);
    const pB = new AmmoLib.btVector3(pivotB.x, pivotB.y, pivotB.z);
    const c = new AmmoLib.btPoint2PointConstraint(bodyA, bodyB, pA, pB);
    this.world.addConstraint(c, true);
    this.constraints.push(c);
    return c;
  }

  step(dt) {
    if (!this.world) return;
    if (dt === undefined) {
      dt = this._clock.getDelta();
    }
    this.world.stepSimulation(dt, 10);

    for (const [node, body] of this.objects) {
      const ms = body.getMotionState();
      if (ms) {
        ms.getWorldTransform(this._transform);
        const p = this._transform.getOrigin();
        const q = this._transform.getRotation();
        node.position.set(p.x(), p.y(), p.z());
        node.quaternion.set(q.x(), q.y(), q.z(), q.w());
        node.updateMatrix();
      }
    }
  }
}

export class Vehicle {
  constructor(physicsWorld, chassisBody) {
    const AmmoLib = physicsWorld.Ammo;
    this.physicsWorld = physicsWorld;
    this.tuning = new AmmoLib.btVehicleTuning();
    this.rayCaster = new AmmoLib.btDefaultVehicleRaycaster(physicsWorld.world);
    this.vehicle = new AmmoLib.btRaycastVehicle(
      this.tuning,
      chassisBody,
      this.rayCaster
    );
    chassisBody.setActivationState(4);
    physicsWorld.world.addAction(this.vehicle);
  }

  addWheel(connectionPoint, direction, axle, suspensionRestLength, radius, isFront) {
    const AmmoLib = this.physicsWorld.Ammo;
    this.vehicle.addWheel(
      new AmmoLib.btVector3(connectionPoint.x, connectionPoint.y, connectionPoint.z),
      new AmmoLib.btVector3(direction.x, direction.y, direction.z),
      new AmmoLib.btVector3(axle.x, axle.y, axle.z),
      suspensionRestLength,
      radius,
      this.tuning,
      isFront
    );
  }

  applyEngineForce(force, wheelIndex) {
    this.vehicle.applyEngineForce(force, wheelIndex);
  }

  setSteeringValue(value, wheelIndex) {
    this.vehicle.setSteeringValue(value, wheelIndex);
  }

  setBrake(value, wheelIndex) {
    this.vehicle.setBrake(value, wheelIndex);
  }
}

export class RagDoll {
  constructor(physicsWorld, position = new THREE.Vector3()) {
    this.physicsWorld = physicsWorld;
    this.parts = [];
    this.constraints = [];

    const size = 0.5;
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(size, size * 1.5, size),
      new THREE.MeshNormalMaterial()
    );
    torso.position.copy(position);
    physicsWorld.addBody(torso, { shape: 'box', size: [size, size * 1.5, size], mass: 1 });
    this.parts.push(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(size / 2, 16, 16),
      new THREE.MeshNormalMaterial()
    );
    head.position.copy(position).add(new THREE.Vector3(0, size, 0));
    const headBody = physicsWorld.addBody(head, { shape: 'sphere', radius: size / 2, mass: 0.5 });
    this.parts.push(head);

    physicsWorld.addPointToPointConstraint(
      physicsWorld.objects.get(torso),
      headBody,
      { x: 0, y: size * 0.75, z: 0 },
      { x: 0, y: -size / 2, z: 0 }
    );
  }
}

