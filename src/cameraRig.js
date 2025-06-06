import { Input } from './input.js';

export class CameraRig {
  constructor(camera, target = new THREE.Object3D()) {
    this.camera = camera;
    this.target = target;
    this.mode = 'FPS';
    this.pitch = 0;
    this.yaw = 0;
    this.offset = new THREE.Vector3(0, 2, -5);
    this.orbitRadius = 5;
  }

  setMode(mode) {
    this.mode = mode;
  }

  update() {
    this.yaw -= Input.get('lookX');
    this.pitch -= Input.get('lookY');
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

    if (this.mode === 'FPS') {
      this.camera.position.copy(this.target.position);
      this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    } else if (this.mode === 'TPS') {
      const offsetRotated = this.offset.clone();
      offsetRotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      this.camera.position.copy(this.target.position).add(offsetRotated);
      this.camera.lookAt(this.target.position);
    } else if (this.mode === 'ORBITAL') {
      const x = this.orbitRadius * Math.sin(this.yaw) * Math.cos(this.pitch);
      const y = this.orbitRadius * Math.sin(this.pitch);
      const z = this.orbitRadius * Math.cos(this.yaw) * Math.cos(this.pitch);
      this.camera.position.set(
        this.target.position.x + x,
        this.target.position.y + y,
        this.target.position.z + z
      );
      this.camera.lookAt(this.target.position);
    }
  }
}
