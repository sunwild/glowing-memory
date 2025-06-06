export class Editor {
  constructor(engine) {
    this.engine = engine;
    this.gui = null;
    this.controls = null;
    this.consoleInput = null;
  }

  async open() {
    if (this.gui) return;
    const { GUI } = await import('https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm');
    const { TransformControls } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/TransformControls.js');

    this.gui = new GUI();
    const folder = this.gui.addFolder('Inspector');

    const names = this.engine.objects.map((_, i) => `Object${i}`);
    const params = { selected: names[0] || null, mode: 'translate' };

    const select = folder.add(params, 'selected', [null, ...names]);
    select.onChange((name) => {
      if (this.controls) {
        this.controls.detach();
        this.engine.scene.remove(this.controls);
      }
      if (name) {
        const idx = names.indexOf(name);
        const obj = this.engine.objects[idx].mesh;
        this.controls = new TransformControls(this.engine.camera, this.engine.renderer.domElement);
        this.controls.attach(obj);
        this.engine.scene.add(this.controls);
      }
    });

    folder.add(params, 'mode', ['translate', 'rotate', 'scale']).onChange((m) => {
      if (this.controls) this.controls.setMode(m);
    });
    folder.open();

    this.consoleInput = document.createElement('input');
    this.consoleInput.type = 'text';
    this.consoleInput.placeholder = 'Console command';
    this.consoleInput.style.position = 'absolute';
    this.consoleInput.style.bottom = '0';
    this.consoleInput.style.left = '0';
    this.consoleInput.style.width = '100%';
    document.body.appendChild(this.consoleInput);

    this.consoleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        try {
          /* eslint-disable no-eval */
          const result = eval(e.target.value);
          console.log(result);
        } catch (err) {
          console.error(err);
        }
        e.target.value = '';
      }
    });
  }

  update() {
    if (this.controls) this.controls.update();
  }
}
