import { InventoryWidget } from './widgets/InventoryWidget.js';
import { MiniMapWidget } from './widgets/MiniMapWidget.js';
import { DialogWidget } from './widgets/DialogWidget.js';

export class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.domLayer = document.createElement('div');
    this.domLayer.id = 'ui-layer';
    document.body.appendChild(this.domLayer);

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'ui-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.widgets = {
      inventory: new InventoryWidget('inventory'),
      minimap: new MiniMapWidget('minimap', scene),
      dialog: new DialogWidget('dialog')
    };

    for (const w of Object.values(this.widgets)) {
      w.attach(this.domLayer);
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  show(screenId, data = {}) {
    const widget = this.widgets[screenId];
    if (widget) {
      widget.show(data);
    }
  }
}
