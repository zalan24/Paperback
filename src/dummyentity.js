class DummyEntity extends Entity {
  constructor(mesh, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.mesh = mesh;

    this.time = 0;
  }
  render(renderData) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    renderDummy(renderData, {
      count: this.mesh.faces.length * 3,
      model: this.getTransform()
    });
  }

  update(updateData) {
    this.time += updateData.dt;
    let scale = (Math.sin(this.time * 4 * Math.PI) + 2) / 2;
    let angle = (this.time * 2 * Math.PI) / 3;
    // this.transform = transformMatMat(
    //   getTranslation(new vec3(0, Math.sin(this.time * 2 * Math.PI), 0)),
    //   transformMatMat(
    //     getScaling(new vec3(scale, scale, scale)),
    //     getRotation(normalize(new vec3(1, 1, 0)), angle)
    //   )
    // );
    updateVertexData(this.mesh, this.vertex_buffer, this.index_buffer);
  }

  start() {}
}

function createCube() {
  let vertices = [];
  let faces = [];
  vertices.push(new Vertex(new vec3(-1, -1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, -1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, 1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(-1, 1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, -1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, -1, 1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, 1, -1), new vec3(0, 0)));
  vertices.push(new Vertex(new vec3(1, 1, 1), new vec3(0, 0)));

  // left
  faces.push(new Face(0, 1, 2));
  faces.push(new Face(2, 1, 3));

  // right
  faces.push(new Face(4, 5, 6));
  faces.push(new Face(6, 5, 7));

  // bottom
  faces.push(new Face(0, 1, 4));
  faces.push(new Face(4, 1, 5));

  // top
  faces.push(new Face(2, 3, 6));
  faces.push(new Face(6, 3, 7));

  // front
  faces.push(new Face(0, 2, 4));
  faces.push(new Face(4, 2, 6));

  // back
  faces.push(new Face(1, 3, 5));
  faces.push(new Face(5, 3, 7));

  return new Mesh(vertices, faces);
}
