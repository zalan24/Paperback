class DummyEntity extends Entity {
  constructor(mesh, transform = new mat3x4()) {
    super(transform);
  }
  render(renderData) {}

  update(updateData) {}

  start() {}
}
