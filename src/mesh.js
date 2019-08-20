class Vertex {
  constructor(position, texcoord) {
    this.position = position;
    this.texcoord = texcoord;
  }
}

class Mesh {
  constructor(vertices = [], indices = []) {
    this.vertices = vertices;
    this.indices = indices;
  }
}

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

// TODO check if this is removed in release
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
