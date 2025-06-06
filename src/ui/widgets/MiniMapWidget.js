import { UIWidget } from '../uiWidget.js';

export class MiniMapWidget extends UIWidget {
  constructor(id, scene) {
    super(id, { classes: ['minimap'] });
    this.el.innerHTML = '<canvas></canvas>';
    this.canvas = this.el.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: 0xffffff, opacity: 0.5 })
    );
    this.sprite.scale.set(1, 1, 1);
    this.sprite.position.set(0, 5, -5);
    scene.add(this.sprite);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = 150;
    this.canvas.height = 150;
  }

  update(data = {}) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = '#0f0';
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
