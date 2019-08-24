class Vertex {
  constructor(position, texcoord) {
    this.position = position;
    this.texcoord = texcoord;
    this.enabled = false;
  }
}

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Mesh {
  constructor(vertices = [], faces = []) {
    this.vertices = vertices;
    this.faces = faces;
  }
}

function createFromPlane(width, height, transform) {
  let vertices = [];
  let faces = [];
  for (let j = 0; j <= height; ++j) {
    for (let i = 0; i <= width; ++i) {
      vertices.push(
        new Vertex(
          transform(i / width, j / height),
          new vec3(i / width, j / height)
        )
      );
      if (i > 0 && j > 0) {
        let ind3 = i + j * (width + 1);
        let ind2 = ind3 - 1;
        let ind1 = ind3 - (width + 1);
        let ind0 = ind1 - 1;
        faces.push(new Face(ind0, ind1, ind2));
        faces.push(new Face(ind2, ind1, ind3));
      }
    }
  }
  return new Mesh(vertices, faces);
}
