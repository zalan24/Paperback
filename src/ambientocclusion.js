function uploadOccluders(entities) {
  let occluders = [];
  entities.forEach(r =>
    traverseEntities(r, e => {
      if (e.mesh != null && e.occluder) {
        let pos = transformMatPosition(e.getTransform(), new vec3());
        let radius = 0;
        let count = 0;
        traverseVertices(e.mesh, v => {
          if (v.enabled) {
            let vpos = transformMatPosition(e.getTransform(), v.position);
            let dist = lengthVec(pos, vpos);
            radius += dist;
            count++;
          }
        });
        if (count > 0) occluders.concat([pos.x, pos.y, pos.z, radius / count]);
      }
    })
  );
  // TODO upload
}
