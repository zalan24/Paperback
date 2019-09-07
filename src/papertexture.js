function createPaperCard(texture) {
  texture.paperTexture = { ready: false, loaders: [] };
  texture.onload = function() {
    let scalingFactor = texture.paper.scalingFactor;
    let paperColor = texture.paper.paperColor;
    let filterSize = texture.paper.filterSize;
    // let stepRadius = texture.paper.stepRadius;
    let stepLimit = texture.paper.stepLimit;
    let vertexSize = texture.paper.vertexSize;
    // TODO update middle based on filterSize
    let preSmallData = new ImageData(
      texture.texture.data.width + 2 * filterSize,
      texture.texture.data.height + 2 * filterSize
    );
    const black = { r: 0, g: 0, b: 0, a: 1 };
    foreachPixel(
      preSmallData,
      0,
      0,
      preSmallData.width,
      preSmallData.height,
      (x, y) => {
        let p = getPixel(texture.texture.data, x - filterSize, y - filterSize);
        // let p = {
        //   r:
        //     x >= filterSize &&
        //     y >= filterSize &&
        //     x < preSmallData.width - filterSize &&
        //     y < preSmallData.height - filterSize
        //       ? ((x + 1) * (y + 1)) / (preSmallData.width * preSmallData.height)
        //       : // getPixel(texture.texture.data, x - filterSize, y - filterSize)
        //         black,
        //   g: 0,
        //   b: 0,
        //   a: 1
        // };
        // if (x >= preSmallData.width - filterSize) p.r = 0;
        if (p.r == 0) p.a = 0;
        else p = lerpColor(black, texture.color, p.r);
        return p;
      }
    );
    let imageData = new ImageData(
      preSmallData.width * scalingFactor,
      preSmallData.height * scalingFactor
    );
    let smallData = new ImageData(preSmallData.width, preSmallData.height);
    let imageData2 = new ImageData(imageData.width, imageData.height);
    filterImage(
      preSmallData,
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
      // return { r: 0.5, g: 0, b: 0, a: 1 };
      let p = getPixel(
        preSmallData,
        Math.floor(x / scalingFactor),
        Math.floor(y / scalingFactor)
      );
      if (p.a > 0) p.a = 1;
      return p;
    });
    filterImage(
      imageData,
      0,
      0,
      imageData2,
      0,
      0,
      imageData2.width,
      imageData2.height,
      scalingFactor,
      getGaussFilter((3 * scalingFactor) / filterSize),
      (x, y) => {
        let p = getPixel(
          smallData,
          Math.floor(x / scalingFactor),
          Math.floor(y / scalingFactor)
        );
        return p.a > 0 && p.a < 1;
      }
    );
    let middle = texture.middle;
    let min = new vec3(9, 9);
    let max = new vec3(-9, -9);
    let getPixelPos = function(x, y, w, h) {
      let ms = Math.max(w, h);
      return new vec3((x - w * middle.x) / ms, (h * middle.y - y) / ms);
    };
    foreachPixel(imageData, 0, 0, imageData.width, imageData.height, (x, y) => {
      let p = getPixel(
        preSmallData,
        Math.floor(x / scalingFactor),
        Math.floor(y / scalingFactor)
      );
      p = lerpColor(paperColor, p, p.a);
      let a = getPixel(imageData2, x, y).a;
      // p.a = softStep(a, stepLimit - stepRadius, stepLimit + stepRadius);
      p.a = 0;
      if (a > stepLimit) {
        p.a = 1;
        let pos = getPixelPos(x, y, imageData.width, imageData.height);
        min = minVec2D(min, pos);
        max = maxVec2D(max, pos);
      }
      return p;
    });
    let vertices = [];
    let faces = [];
    for (let j = 0; j <= smallData.height; j += vertexSize) {
      for (let i = 0; i <= smallData.width; i += vertexSize) {
        let ind3 = vertices.length;
        let ind1 = ind3 - (smallData.width / vertexSize + 1);
        vertices.push(
          new Vertex(
            getPixelPos(i, j, smallData.width, smallData.height),
            new vec3(0, 0, -1),
            new vec3(i / smallData.width, j / smallData.height)
          )
        );
        if (i > 0 && j > 0) {
          for (let subJ = 0; subJ < vertexSize; ++subJ)
            for (let subI = 0; subI < vertexSize; ++subI) {
              if (getPixel(smallData, i + subI, j + subJ).a > 0) {
                vertices[ind3].enabled = true;
                vertices[ind3 - 1].enabled = true;
                vertices[ind1].enabled = true;
                vertices[ind1 - 1].enabled = true;
                // enabled = true;
                // CAN_BE_REMOVED
                break;
              }
            }
          vertices[ind1 - 1].enabled = true;
          if (vertices[ind1 - 1].enabled) {
            // approximation
            faces.push(new Face(ind1 - 1, ind1, ind3 - 1));
            faces.push(new Face(ind3, ind1, ind3 - 1));
          }
        }
      }
    }
    // let sw = smallData.width / vertexSize;
    // let sh = smallData.height / vertexSize;
    // for (let i = 0; i < sw; i++) {
    //   for (let j = 0; j < sh; j++) {
    //     let ind0 = i + (j * smallData.width) / vertexSize;
    //     let ind2 = ind0 + sw;
    //   }
    // }

    texture.paperTexture.mesh = new Mesh(vertices, faces);
    texture.paperTexture.box = { a: min, b: max };
    // console.log({ name: "aoeu", box: texture.paperTexture.box });
    let retData = imageData;
    // let retData = smallData;
    texture.paperTexture.texture = extractTexture(
      retData,
      {
        x: 0,
        y: 0,
        w: retData.width,
        h: retData.height
      },
      function() {
        texture.paperTexture.ready = true;
        texture.paperTexture.loaders.forEach(loader => loader());
      }
    );
  };
}

function usePaperTexture(paperTex, loader) {
  if (paperTex.ready) loader();
  else paperTex.loaders.push(loader);
}
