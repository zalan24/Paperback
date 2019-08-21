class Entity {
  constructor(transform = new mat3x4()) {
    this.transform = transform;
    this.entities = [];
    this.parent = null;
  }

  addChild(c) {
    this.entities.push(c);
    c.parent = this;
  }

  getTransform() {
    if (this.parent == null) return this.transform;
    return transformMatMat(this.parent.getTransform(), this.transform);
  }
}

function traverseEntities(root, f) {
  f(root);
  root.entities.forEach(element => {
    traverseEntities(element, f);
  });
}
