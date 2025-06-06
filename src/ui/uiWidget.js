export class UIWidget {
  constructor(id, { classes = [] } = {}) {
    this.id = id;
    this.el = document.createElement('div');
    this.el.classList.add('ui-widget', ...classes);
    this.el.dataset.widget = id;
    this.hide();
  }

  attach(parent) {
    parent.appendChild(this.el);
  }

  show(data = {}) {
    this.el.style.display = 'block';
    this.update(data);
  }

  hide() {
    this.el.style.display = 'none';
  }

  update(data) {
    // override in subclasses
  }

  emit(event, detail = {}) {
    this.el.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
