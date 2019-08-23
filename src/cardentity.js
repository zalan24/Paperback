class CardEntity extends Entity {
  constructor(paperTexture, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.paperTexture = paperTexture;
    this.mesh = null;
    // this.texture = null;
    let t = this;
    usePaperTexture(paperTexture, function() {
      t.mesh = paperTexture.mesh;
      t.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        paperTexture.texture.img
      );
      // Set filtering modes.
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      // Set wrapping modes.
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Unbind the texture.
      gl.bindTexture(gl.TEXTURE_2D, null);
    });
  }
  render(renderData) {
    if (this.mesh == null) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    renderDummy(renderData, {
      count: this.mesh.faces.length * 3,
      model: this.getTransform(),
      texture: this.texture
    });
  }

  update(updateData) {
    if (this.mesh == null) return;
    updateVertexData(this.mesh, this.vertex_buffer, this.index_buffer);
  }

  start() {}
}
