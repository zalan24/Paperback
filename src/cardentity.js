class CardEntity extends Entity {
  constructor(paperTexture, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.paperTexture = paperTexture;
    this.mesh = null;
    let t = this;
    usePaperTexture(paperTexture, function() {
      t.mesh = paperTexture.mesh;
    });
  }
  render(renderData) {
    if (this.mesh == null) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    renderDummy(renderData, {
      count: this.mesh.faces.length * 3,
      model: this.getTransform()
    });
  }

  update(updateData) {
    if (this.mesh == null) return;
    updateVertexData(this.mesh, this.vertex_buffer, this.index_buffer);
  }

  start() {}
}
