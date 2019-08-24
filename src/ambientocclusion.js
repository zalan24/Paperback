function calculateIncomingLight(vertex) {
  vertex.ao.x = 1;
  //   let x00 = cartesianToSpherical(
  //     subVec(new vec3(-windowRad, -windowRad, windowZ), vertex.position)
  //   );
  //   //   let x01 = cartesianToSpherical(
  //   //     subVec(new vec3(-windowRad, windowRad, windowZ), vertex.position)
  //   //   );
  //   //   let x10 = cartesianToSpherical(
  //   //     subVec(new vec3(windowRad, -windowRad, windowZ), vertex.position)
  //   //   );
  //   let x11 = cartesianToSpherical(
  //     subVec(new vec3(windowRad, windowRad, windowZ), vertex.position)
  //   );
  //   let nx = 0;
  //   let ny = 0;
  //   let nz = -1;
  //   let phi0 = x00.x;
  //   let phi1 = x11.x;
  //   if (phi0 > phi1) phi1 += Math.PI * 2;
  //   let theta0 = x00.y;
  //   let theta1 = x11.y;
  //   if (theta0 > theta1) theta1 += Math.PI * 2;
  //   vertex.ao.x =
  //     ((-1 / 2) * (ny * phi0 - ny * phi1) * Math.cos(theta0) * Math.cos(theta0) +
  //       (1 / 2) * (ny * phi0 - ny * phi1) * Math.cos(theta1) * Math.cos(theta1) +
  //       (1 / 2) *
  //         (nz * Math.cos(phi0) -
  //           nz * Math.cos(phi1) -
  //           nx * Math.sin(phi0) +
  //           nx * Math.sin(phi1)) *
  //         Math.cos(theta0) *
  //         Math.sin(theta0) -
  //       (1 / 2) *
  //         (nz * Math.cos(phi0) -
  //           nz * Math.cos(phi1) -
  //           nx * Math.sin(phi0) +
  //           nx * Math.sin(phi1)) *
  //         Math.cos(theta1) *
  //         Math.sin(theta1) -
  //       (1 / 2) *
  //         (nz * Math.cos(phi0) -
  //           nz * Math.cos(phi1) -
  //           nx * Math.sin(phi0) +
  //           nx * Math.sin(phi1)) *
  //         theta0 +
  //       (1 / 2) *
  //         (nz * Math.cos(phi0) -
  //           nz * Math.cos(phi1) -
  //           nx * Math.sin(phi0) +
  //           nx * Math.sin(phi1)) *
  //         theta1) /
  //     (4 * Math.PI);
}

// console.log(cartesianToSpherical(new vec3(-1, 0, 0)));
// console.log(cartesianToSpherical(new vec3(0, 0, -1)));
// console.log(cartesianToSpherical(new vec3(1, 0, 0)));
// console.log(cartesianToSpherical(new vec3(0, 0, 1)));
