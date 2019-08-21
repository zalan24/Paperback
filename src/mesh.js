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
