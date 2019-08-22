class Vertex {
  constructor(position, texcoord) {
    this.position = position;
    this.texcoord = texcoord;
    this.enabled = false;
  }
}

class Mesh {
  constructor(vertices = [], faces = []) {
    this.vertices = vertices;
    this.faces = faces;
  }
}

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
