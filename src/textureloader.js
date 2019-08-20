var textureCanvas = document.getElementById("t");
var textureCtx = textureCanvas.getContext("2d");

var atlases = { test_atlas: { img: new Image(), textures: {} } };
atlases.test_atlas.img.src = "res/test_atlas.png";

function registerTexture(atlas, imageName, x, y, w, h) {
  atlas.textures[imageName] = {
    onload: null,
    rect: { x: x, y: y, w: w, h: h }
  };
}

registerTexture(atlases.test_atlas, "character", 0, 0, 64, 64);
registerTexture(atlases.test_atlas, "sword", 64, 0, 64, 64);

function getImageData(img, atlasObj) {
  textureCanvas.height = img.height;
  textureCanvas.width = img.width;
  textureCtx.drawImage(img, 0, 0);
  atlasObj.imageData = textureCtx.getImageData(0, 0, img.width, img.height);
}

function extractTexture(imageData, rect) {
  let smallData = new ImageData(rect.w, rect.h);
  transformImage(
    imageData,
    rect.x,
    rect.y,
    smallData,
    0,
    0,
    rect.w,
    rect.h,
    p => p
  );
  textureCanvas.width = rect.w;
  textureCanvas.height = rect.h;
  textureCtx.putImageData(smallData, 0, 0);

  let image = new Image();
  image.src = textureCanvas.toDataURL();
  return { img: image, data: smallData };
}

function loadAtlas(atlas) {
  atlas.img.onload = () => {
    getImageData(atlas.img, atlas);
    let keys = Object.keys(atlas.textures);
    for (let i = 0; i < keys.length; ++i) {
      let tex = atlas.textures[keys[i]];
      tex.texture = extractTexture(atlas.imageData, tex.rect);
      if (tex.onload) tex.onload();
    }
  };
}

{
  let atlasKeys = Object.keys(atlases);
  for (let i = 0; i < atlasKeys.length; ++i) {
    loadAtlas(atlases[atlasKeys[i]]);
  }
}
