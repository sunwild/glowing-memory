export class InputSystem {
  constructor() {
    this.bindings = {};
    this.state = {};
    this.sensitivity = {};

    this.keys = new Set();
    this.mouseButtons = new Set();
    this.mouseDelta = { x: 0, y: 0 };
    this.touchActive = false;

    window.addEventListener('keydown', e => this.keys.add(e.code));
    window.addEventListener('keyup', e => this.keys.delete(e.code));

    window.addEventListener('mousedown', e => this.mouseButtons.add('Mouse' + e.button));
    window.addEventListener('mouseup', e => this.mouseButtons.delete('Mouse' + e.button));
    window.addEventListener('mousemove', e => {
      this.mouseDelta.x += e.movementX;
      this.mouseDelta.y += e.movementY;
    });

    window.addEventListener('touchstart', () => { this.touchActive = true; });
    window.addEventListener('touchend', () => { this.touchActive = false; });
  }

  bind(action, keys, sensitivity = 1) {
    if (!Array.isArray(keys)) keys = [keys];
    this.bindings[action] = keys;
    this.sensitivity[action] = sensitivity;
    this.state[action] = 0;
  }

  update() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const action in this.bindings) {
      const keys = this.bindings[action];
      let value = 0;
      for (const key of keys) {
        if (key === 'Touch' && this.touchActive) {
          value = 1;
        } else if (this.keys.has(key) || this.mouseButtons.has(key)) {
          value = 1;
        } else if (key === 'MouseMoveX') {
          value += this.mouseDelta.x * this.sensitivity[action];
        } else if (key === 'MouseMoveY') {
          value += this.mouseDelta.y * this.sensitivity[action];
        } else if (key.startsWith('GP')) {
          const idx = parseInt(key.slice(2));
          for (const gp of gamepads) {
            if (gp && gp.buttons[idx] && gp.buttons[idx].pressed) {
              value = 1;
            }
          }
        } else if (key.startsWith('AXIS')) {
          const a = parseInt(key.slice(4));
          for (const gp of gamepads) {
            if (gp && gp.axes.length > a) {
              value += gp.axes[a] * this.sensitivity[action];
            }
          }
        }
      }
      this.state[action] = value;
    }
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
  }

  get(action) {
    return this.state[action] || 0;
  }
}

export const Input = new InputSystem();
