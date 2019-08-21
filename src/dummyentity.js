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
    renderDummy(renderData, {
      count: this.mesh.indices.length * 3,
      model: this.transform
    });
  }

  update(updateData) {
    this.updateVertexData();
  }

  start() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    let indices = [];
    this.mesh.indices.forEach(ind => {
      indices.push(ind.a);
      indices.push(ind.b);
      indices.push(ind.c);
    });
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  updateVertexData() {
    let vertices = [];
    this.mesh.vertices.forEach(v => {
      vertices.push(v.position.x);
      vertices.push(v.position.y);
      vertices.push(v.position.z);
    });
    // let vertices = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.0, -0.5, 0, 0.0, 0.5, 0];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

function createCube() {
  let vertices = [];
  let indices = [];
  vertices.push(new Vertex(new vec3(-1, -1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, -1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, 1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, 1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, -1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, -1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, 1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, 1, 1), new vec3(0, 0)));

  // left
  indices.push(new Face(0, 1, 2));
  indices.push(new Face(2, 1, 3));

  // right
  indices.push(new Face(4, 5, 6));
  indices.push(new Face(6, 5, 7));

  // bottom
  indices.push(new Face(0, 1, 4));
  indices.push(new Face(4, 1, 5));

  // top
  indices.push(new Face(2, 3, 6));
  indices.push(new Face(6, 3, 7));

  // front
  indices.push(new Face(0, 2, 4));
  indices.push(new Face(4, 2, 6));

  // back
  indices.push(new Face(1, 3, 5));
  indices.push(new Face(5, 3, 7));

  return new Mesh(vertices, indices);
}
