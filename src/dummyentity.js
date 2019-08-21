class DummyEntity extends Entity {
  constructor(mesh, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.mesh = mesh;
  }
  render(renderData) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    renderDummy(renderData, { count: this.mesh.indices.length });
  }

  update(updateData) {
    this.updateVertexData();
  }

  start() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    // let indices = [];
    // this.mesh.indices.forEach(ind => {
    //   indices.push(ind.a);
    //   indices.push(ind.b);
    //   indices.push(ind.c);
    // });
    var indices = [
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23
    ];
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  updateVertexData() {
    // let vertices = [];
    // this.mesh.vertices.forEach(v => {
    //   vertices.push(v.position.x);
    //   vertices.push(v.position.y);
    //   vertices.push(v.position.z);
    // });
    let vertices = [
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1
    ];
    // let vertices = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.0, -0.5, 0, 0.0, 0.5, 0];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
