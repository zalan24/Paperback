function uploadOccluders(entities) {
  let occluders = [];
  entities.forEach(r =>
    traverseEntities(r, e => {
      if (e.mesh != null && e.occluder) {
        let pos = transformMatPosition(e.getTransform(), new vec3());
        let norm = transformMatDirection(e.getTransform(), new vec3(0, 0, 1));
        let radius = new vec3();
        let count = 0;
        traverseVertices(e.mesh, v => {
          if (v.enabled) {
            let vpos = transformMatPosition(e.getTransform(), v.position);
            let dist = new vec3(
              abs(pos.x - vpos.x),
              abs(pos.y - vpos.y),
              abs(pos.z - vpos.z)
            );
            radius = addVec(radius, dist);
            count++;
          }
        });
        if (count > 0) {
          radius = mulVecScalar(radius, 1 / count);
          occluders.concat([
            pos.x,
            pos.y,
            pos.z,
            radius.x,
            radius.y,
            radius.z,
            norm.x,
            norm.y,
            norm.z
          ]);
        }
        // occluders = occluders.concat([pos.x, pos.y, pos.z, 1]);
      }
    })
  );
  setOccluders(occluders);
}
