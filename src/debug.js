console.log("time: " + new Date().toLocaleString());

let paperTexture = resources.textures.sword.paperTexture;
usePaperTexture(paperTexture, function() {
  // console.log("aoeu");
  //   var testImage = document.getElementById("testImage");
  //   testImage.src = resources.textures.character.paperTexture.texture.img.src;

  var debugTexture = resources.textures.character.paperTexture.texture.img;

  //   ctx.fillStyle = "#FF0000";
  //   ctx.fillRect(0, 0, 512, 512);

  //   debugTexture.onload = function() {
  //     console.log(
  //       "debugTexture size: " + debugTexture.width + "x" + debugTexture.height
  //     );
  //     ctx.drawImage(debugTexture, 0, 0);
  //   };

  var testImage = document.getElementById("testImage");
  testImage.src = debugTexture.src;
});

// let cube = createCube();
// let cubeEntity = new DummyEntity(cube);
let child = new CardEntity(paperTexture);
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
    getTranslation(new vec3(-3, 0, 0))
  )
);
