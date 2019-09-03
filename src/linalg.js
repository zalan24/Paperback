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

function lerpVec(a, b, f) {
  return addVec(mulVecScalar(subVec(b, a), f));
}

function cross(a, b) {
  return new vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

function lengthVecSq(a) {
  return dot(a, a);
}

function lengthVec(a) {
  return Math.sqrt(lengthVecSq(a));
}

function normalize(a) {
  return mulVecScalar(a, 1 / lengthVec(a));
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
  getFloats() {
    let ret = [
      this.col0.x,
      this.col0.y,
      this.col0.z,
      0,
      this.col1.x,
      this.col1.y,
      this.col1.z,
      0,
      this.col2.x,
      this.col2.y,
      this.col2.z,
      0,
      this.col3.x,
      this.col3.y,
      this.col3.z,
      1
    ];
    return ret;
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

function lookAt(eyePos, target, up) {
  // TODO this might not work if the determinant is not one
  let dir = normalize(subVec(target, eyePos));
  let side = normalize(cross(up, dir));
  let up2 = cross(dir, side);
  let mat = new mat3x4(side, up2, dir);
  let t_inv = new mat3x4();
  // ret = inv(t * mat) = inv(mat) * inv(t)
  t_inv.col3 = mulVecScalar(eyePos, -1);
  // console.log(mat);
  let row0 = cross(mat.col1, mat.col2);
  let row1 = cross(mat.col2, mat.col0);
  let row2 = cross(mat.col0, mat.col1);
  let r12det = cross(row1, row2);
  let det = dot(mulVec(new vec3(1, -1, 1), row0), r12det);
  // console.log(det);
  row0 = mulVecScalar(row0, 1 / det);
  row1 = mulVecScalar(row1, 1 / det);
  row2 = mulVecScalar(row2, 1 / det);
  let inv = new mat3x4(
    new vec3(row0.x, row1.x, row2.x),
    new vec3(row0.y, row1.y, row2.y),
    new vec3(row0.z, row1.z, row2.z)
  );

  let ret = transformMatMat(inv, t_inv);
  // console.log(ret);
  // console.log(transformMatMat(ret, new mat3x4(side, up2, dir, eyePos)));
  return ret;
}

function getProjection(angle, a, zMin, zMax) {
  // https://www.tutorialspoint.com/webgl/webgl_interactive_cube.htm
  var ang = Math.tan((angle * 0.5 * Math.PI) / 180); //angle*.5
  return [
    0.5 / ang,
    0,
    0,
    0,
    0,
    (0.5 * a) / ang,
    0,
    0,
    0,
    0,
    (zMax + zMin) / (zMax - zMin),
    1,
    0,
    0,
    (-2 * zMax * zMin) / (zMax - zMin),
    0
  ];
}

function getTranslation(t) {
  let ret = new mat3x4();
  ret.col3 = t;
  return ret;
}

function getScaling(s) {
  let ret = new mat3x4();
  ret.col0.x = s.x;
  ret.col1.y = s.y;
  ret.col2.z = s.z;
  return ret;
}

function getRotation(axis, angle) {
  let c = Math.cos(angle);
  let s = Math.sin(angle);
  return new mat3x4(
    new vec3(
      c + axis.x * axis.x * (1 - c),
      axis.x * axis.y * (1 - c) + axis.z * s,
      axis.x * axis.z * (1 - c) - axis.y * s
    ),
    new vec3(
      axis.x * axis.y * (1 - c) - axis.z * s,
      axis.y * axis.y * (1 - c) + c,
      axis.y * axis.z * (1 - c) + axis.x * s
    ),
    new vec3(
      axis.x * axis.z * (1 - c) + axis.y * s,
      axis.y * axis.z * (1 - c) - axis.x * s,
      axis.z * axis.z * (1 - c) + c
    )
  );
}

// function lerpVec(a, b, f) {
//   return addVec(mulVecScalar(subVec(b, a), f), a);
// }

function cartesianToSpherical(pos) {
  pos = normalize(pos);
  return new vec3(Math.atan2(pos.z, pos.x), Math.acos(pos.y));
}
