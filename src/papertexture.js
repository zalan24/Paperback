function createPaperTexture(texture) {
  texture.paperTexture = { onload: null };
  texture.onload = function() {
    let scalingFactor = 8;
    let filterSize = 2;
    let imageData = new ImageData(
      texture.texture.data.width * scalingFactor,
      texture.texture.data.width * scalingFactor
    );
    let smallData = new ImageData(
      texture.texture.data.width,
      texture.texture.data.width
    );
    // let imageData2 = new ImageData(
    //   texture.texture.data.width * scalingFactor,
    //   texture.texture.data.width * scalingFactor
    // );
    filterImage(
      texture.texture.data,
      0,
      0,
      smallData,
      0,
      0,
      smallData.width,
      smallData.height,
      filterSize,
      getGaussFilter(3 / filterSize)
    );
    foreachPixel(imageData, 0, 0, imageData.width, imageData.height, (x, y) => {
      let p = getPixel(
        smallData,
        Math.floor(x / scalingFactor),
        Math.floor(y / scalingFactor)
      );
      return p;
      //   if (p.a > 0) return { a: 1, r: 1, g: 1, b: 1 };
      //   else return { a: 0, r: 0, g: 0, b: 0 };
    });
    // filterImage(imageData, 0, 0, imageData2, 0, 0, imageData2.width, imageData2.height, scalingFactor)

    texture.paperTexture.texture = extractTexture(imageData, {
      x: 0,
      y: 0,
      w: imageData.width,
      h: imageData.height
    });
    if (texture.paperTexture.onload) texture.paperTexture.onload();
  };
}
