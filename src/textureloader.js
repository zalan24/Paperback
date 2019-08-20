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

function extractTexture(imageData, rect, atlasWidth) {
  var smallData = new ImageData(rect.w, rect.h);
  const perPixelData = 4;
  for (var i = 0; i < rect.w * perPixelData; ++i) {
    for (var j = 0; j < rect.h; ++j) {
      smallData.data[i + j * rect.w * perPixelData] =
        imageData.data[
          i + rect.x * perPixelData + (j + rect.y) * atlasWidth * perPixelData
        ];
    }
  }
  // TODO we don't need image, only image data here
  textureCanvas.width = rect.w;
  textureCanvas.height = rect.h;
  textureCtx.putImageData(smallData, 0, 0);

  var image = new Image();
  image.src = textureCanvas.toDataURL();
  return { img: image, data: smallData };
}

function loadAtlas(atlas) {
  atlas.img.onload = () => {
    getImageData(atlas.img, atlas);
    var keys = Object.keys(atlas.textures);
    for (var i = 0; i < keys.length; ++i) {
      var tex = atlas.textures[keys[i]];
      tex.texture = extractTexture(atlas.imageData, tex.rect, atlas.img.width);
      if (tex.onload) tex.onload();
    }
  };
}

var atlasKeys = Object.keys(atlases);
for (var i = 0; i < atlasKeys.length; ++i) {
  loadAtlas(atlases[atlasKeys[i]]);
}
