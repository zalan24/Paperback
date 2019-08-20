class Entity {
  constructor(transform = new mat3x4()) {
    this.transform = transform;
    this.entities = [];
  }
}

function traverseEntities(root, f) {
  f(root);
  root.entities.forEach(element => {
    traverseEntities(element, f);
  });
}
