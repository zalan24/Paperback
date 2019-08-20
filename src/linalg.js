class vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function addVec(a, b) {
  return new vec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function mulVec(a, b) {
  return new vec3(a.x * b.x, a.y * b.y, a.z * b.z);
}

function mulVecScalar(a, b) {
  return new vec3(a.x * b, a.y * b, a.z * b);
}

function subVec(a, b) {
  return addVec(a, mulVecScalar(b, -1));
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return new vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

class mat3x4 {
  constructor(
    col0 = new vec3(1, 0, 0),
    col1 = new vec3(0, 1, 0),
    col2 = new vec3(0, 0, 1),
    col3 = new vec3(0, 0, 0)
  ) {
    this.col0 = col0;
    this.col1 = col1;
    this.col2 = col2;
    this.col3 = col3;
  }
}

function transformMatPosition(m, v) {
  return addVec(
    addVec(mulVecScalar(m.col0, v.x), mulVecScalar(m.col1, v.y)),
    addVec(mulVecScalar(m.col2, v.z), m.col3)
  );
}

function transformMatDirection(m, v) {
  return addVec(
    addVec(mulVecScalar(m.col0, v.x), mulVecScalar(m.col1, v.y)),
    mulVecScalar(m.col2, v.z)
  );
}

function transformMatMat(a, b) {
  return new mat3x4(
    transformMatDirection(a, b.col0),
    transformMatDirection(a, b.col1),
    transformMatDirection(a, b.col2),
    transformMatPosition(a, b.col3)
  );
}
