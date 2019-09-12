var defaultPaperData = {
  scalingFactor: 8,
  paperColor: { r: 221 / 255, g: 217 / 255, b: 195 / 255, a: 1 },
  filterSize: 2,
  // stepRadius: 0.05,
  stepLimit: 0.5,
  vertexSize: 1 // in terms of smallData pixels
};

var textureProps = {
  atlas: {
    resource: "res/atlas.png",
    textures: {
      character: {
        rect: {
          x: 0,
          y: 0,
          w: 8,
          h: 16
        },
        // middle: { x: 25 / 64, y: 32 / 64 },
        paper: defaultPaperData,
        color: { r: 0.3, g: 0.35, b: 1, a: 1 }
      },
      enemy: {
        rect: {
          x: 0,
          y: 0,
          w: 8,
          h: 16
        },
        // middle: { x: 25 / 64, y: 32 / 64 },
        paper: defaultPaperData,
        color: { r: 1, g: 0.35, b: 0.1, a: 1 }
      },
      horn: {
        rect: {
          x: 8,
          y: 0,
          w: 4,
          h: 4
        },
        paper: defaultPaperData,
        color: { r: 1, g: 0, b: 0, a: 1 }
      },
      sword: {
        rect: {
          x: 8,
          y: 4,
          w: 4,
          h: 4
        },
        paper: defaultPaperData,
        color: { r: 0, g: 1, b: 0, a: 1 }
      },
      heart: {
        rect: {
          x: 8,
          y: 8,
          w: 4,
          h: 4
        },
        paper: defaultPaperData,
        color: { r: 1, g: 0, b: 0, a: 1 }
      },
      door: {
        rect: {
          x: 12,
          y: 0,
          w: 4,
          h: 16
        },
        paper: defaultPaperData,
        color: { r: 0, g: 0, b: 1, a: 1 }
      },
      platform: {
        rect: {
          x: 16,
          y: 0,
          w: 4,
          h: 16
        },
        paper: defaultPaperData,
        color: { r: 0, g: 0, b: 1, a: 1 }
      },
      tree: {
        rect: {
          x: 21,
          y: 0,
          w: 7,
          h: 16
        },
        paper: defaultPaperData,
        color: { r: 0, g: 1, b: 0, a: 1 }
      },
      mountain: {
        rect: {
          x: 28,
          y: 0,
          w: 16,
          h: 16
        },
        paper: defaultPaperData,
        color: { r: 1, g: 1, b: 1, a: 1 }
      }
    }
  }
};
