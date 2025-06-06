export class TransformNode extends THREE.Object3D {
  constructor() {
    super();
  }
}

export class SceneGraph {
  constructor() {
    this.root = new TransformNode();
  }

  /**
   * Add a node to the scene graph.
   * @param {THREE.Object3D} node - Node to add.
   * @param {THREE.Object3D} [parent=this.root] - Parent node.
   */
  add(node, parent = this.root) {
    parent.add(node);
  }
}
