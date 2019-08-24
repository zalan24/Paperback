console.log("time: " + new Date().toLocaleString());

let child = new CardEntity(resources.textures.sword.paperTexture);
child.transform =
  // transformMatMat(
  //   getTranslation(new vec3(1, 1, 1)),
  getScaling(new vec3(2, 2, 2));
// );
// cubeEntity.addChild(child);
// addEntity(cubeEntity);
let characterScale = 0.2;
addEntity(child);
let character = createCardWithStick(
  new CardEntity(
    resources.textures.character.paperTexture,
    getScaling(new vec3(characterScale, characterScale, characterScale))
  ),
  { r: 1, g: 0, b: 0, a: 1 }
);
character.transform = getTranslation(new vec3(0, 0, -0.5));
addEntity(character);
