var defaultPaperData = {
  scalingFactor: 8,
  paperColor: { r: 221 / 255, g: 217 / 255, b: 195 / 255, a: 1 },
  filterSize: 2,
  stepRadius: 0.05,
  stepLimit: 0.5,
  vertexSize: 4 // in terms of smallData pixels
};

var textureProps = {
  test_atlas: {
    resource: "res/test_atlas.png",
    textures: {
      character: {
        rect: {
          x: 0,
          y: 0,
          w: 64,
          h: 64
        },
        paper: defaultPaperData
      },
      sword: {
        rect: {
          x: 64,
          y: 0,
          w: 64,
          h: 64
        },
        paper: defaultPaperData
      }
    }
  }
};
