import { UIWidget } from '../uiWidget.js';

export class InventoryWidget extends UIWidget {
  constructor(id) {
    super(id, { classes: ['inventory'] });
    this.el.innerHTML = '<h3>Inventory</h3><ul class="items"></ul>';
    this.list = this.el.querySelector('.items');
  }

  update({ items = [] } = {}) {
    this.list.innerHTML = '';
    for (const item of items) {
      const li = document.createElement('li');
      li.textContent = item;
      this.list.appendChild(li);
    }
  }
}
