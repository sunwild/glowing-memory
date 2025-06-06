import { UIWidget } from '../uiWidget.js';

export class DialogWidget extends UIWidget {
  constructor(id) {
    super(id, { classes: ['dialog'] });
    this.el.innerHTML = '<p class="message"></p><button>Ok</button>';
    this.message = this.el.querySelector('.message');
    this.button = this.el.querySelector('button');
    this.button.addEventListener('click', () => this.emit('close'));
  }

  update({ message = '' } = {}) {
    this.message.textContent = message;
  }
}
