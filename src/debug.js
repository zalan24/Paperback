console.log("time: " + new Date().toLocaleString());

let child = new CardEntity(resources.textures.sword.paperTexture);
child.transform =
  // transformMatMat(
  //   getTranslation(new vec3(1, 1, 1)),
  getScaling(new vec3(2, 2, 2));
// );
// cubeEntity.addChild(child);
// addEntity(cubeEntity);
addEntity(child);
addEntity(
  new CardEntity(
    resources.textures.character.paperTexture,
    getTranslation(new vec3(0, 0, 1))
  )
);
