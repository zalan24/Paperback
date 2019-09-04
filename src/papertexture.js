function createPaperCard(texture) {
  texture.paperTexture = { ready: false, loaders: [] };
  texture.onload = function() {
    let scalingFactor = texture.paper.scalingFactor;
    let paperColor = texture.paper.paperColor;
    let filterSize = texture.paper.filterSize;
    // let stepRadius = texture.paper.stepRadius;
    let stepLimit = texture.paper.stepLimit;
    let vertexSize = texture.paper.vertexSize;
    let imageData = new ImageData(
      texture.texture.data.width * scalingFactor,
      texture.texture.data.width * scalingFactor
    );
    let smallData = new ImageData(
      texture.texture.data.width,
      texture.texture.data.width
    );
    let imageData2 = new ImageData(
      texture.texture.data.width * scalingFactor,
      texture.texture.data.width * scalingFactor
    );
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
        texture.texture.data,
        Math.floor(x / scalingFactor),
        Math.floor(y / scalingFactor)
      );
      //   return p;
      if (p.a > 0) return { a: 1, r: 1, g: 1, b: 1 };
      else return { a: 0, r: 1, g: 1, b: 1 };
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
    foreachPixel(imageData, 0, 0, imageData.width, imageData.height, (x, y) => {
      let p = getPixel(
        texture.texture.data,
        Math.floor(x / scalingFactor),
        Math.floor(y / scalingFactor)
      );
      p = lerpColor(paperColor, p, p.a);
      let a = getPixel(imageData2, x, y).a;
      // p.a = softStep(a, stepLimit - stepRadius, stepLimit + stepRadius);
      p.a = 0;
      if (a > stepLimit) p.a = 1;
      return p;
    });
    let vertices = [];
    let faces = [];
    let maxSize = Math.max(smallData.width, smallData.height);
    let middle = texture.middle;
    let min = new vec3(9, 9);
    let max = new vec3(-9, -9);
    for (let i = 0; i <= smallData.width; i += vertexSize) {
      for (let j = 0; j <= smallData.height; j += vertexSize) {
        let ind3 = vertices.length;
        let ind1 = ind3 - smallData.width / vertexSize;
        vertices.push(
          new Vertex(
            new vec3(
              (i - smallData.width * middle.x) / maxSize,
              (smallData.height * middle.y - j) / maxSize
            ),
            new vec3(0, 0, -1),
            new vec3(i / smallData.width, j / smallData.height)
          )
        );
        if (i > 0 && j > 0) {
          for (let subI = 0; subI < vertexSize; ++subI)
            for (let subJ = 0; subJ < vertexSize; ++subJ) {
              if (getPixel(texture.texture.data, i + subI, j + subJ).a > 0) {
                let pos = new vec3(
                  (subI - smallData.width * middle.x) / maxSize,
                  (smallData.height * middle.y - subJ) / maxSize
                );
                min.x = Math.min(min.x, pos.x);
                min.y = Math.min(min.y, pos.y);
                max.x = Math.max(max.x, pos.x);
                max.y = Math.max(max.y, pos.y);
              }
              if (getPixel(smallData, i + subI, j + subJ).a > 0) {
                vertices[ind3].enabled = true;
                vertices[ind3 - 1].enabled = true;
                vertices[ind1].enabled = true;
                vertices[ind1 - 1].enabled = true;
                enabled = true;
                // CAN_BE_REMOVED
                break;
              }
            }
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
