var defaultPaperData = {
  scalingFactor: 8,
  paperColor: { r: 221 / 255, g: 217 / 255, b: 195 / 255, a: 1 },
  filterSize: 2,
  // stepRadius: 0.05,
  stepLimit: 0.5,
  vertexSize: 1 // in terms of smallData pixels
};

var textureProps = {
  test_atlas: {
    resource: "res/32x8_grayscale.png",
    textures: {
      character: {
        rect: {
          x: 0,
          y: 0,
          w: 8,
          h: 8
        },
        middle: { x: 25 / 64, y: 32 / 64 },
        paper: defaultPaperData,
        color: { r: 1, g: 0, b: 0, a: 1 }
      },
      sword: {
        rect: {
          x: 8,
          y: 0,
          w: 8,
          h: 8
        },
        paper: defaultPaperData,
        color: { r: 0, g: 1, b: 0, a: 1 }
      },
      platform: {
        rect: {
          x: 16,
          y: 0,
          w: 8,
          h: 8
        },
        paper: defaultPaperData,
        color: { r: 0, g: 0, b: 1, a: 1 }
      },
      mountain: {
        rect: {
          x: 24,
          y: 0,
          w: 8,
          h: 8
        },
        paper: defaultPaperData,
        color: { r: 1, g: 1, b: 1, a: 1 }
      }
    }
  }
};
