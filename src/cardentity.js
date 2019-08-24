class CardEntity extends Entity {
  constructor(paperTexture, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.paperTexture = paperTexture;
    this.mesh = null;
    if (paperTexture != null) {
      let t = this;
      usePaperTexture(paperTexture, function() {
        t.mesh = paperTexture.mesh;
        t.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t.texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          paperTexture.texture.img
        );
        // Set filtering modes.
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.bindTexture(gl.TEXTURE_2D, null);
      });
    }
  }
  render(renderData) {
    if (this.mesh == null) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    renderCard(renderData, {
      count: this.mesh.faces.length * 3,
      model: this.getTransform(),
      texture: this.texture
    });
  }

  update(updateData) {
    if (this.mesh == null) return;
    updateVertexData(this.mesh, this.vertex_buffer, this.index_buffer);
  }

  start() {}
}

function hackWallCardEntity(
  o,
  xDir,
  yDir,
  width = 10,
  height = 10,
  color = defaultPaperData.paperColor
) {
  let wall = new CardEntity(null);
  wall.texture = createTextureFromColor(color);
  wall.mesh = createFromPlane(width, height, (x, y) => {
    return addVec(addVec(mulVecScalar(xDir, x), mulVecScalar(yDir, y)), o);
  });
  return wall;
}

function hackStickCardEntity(width, color, o, radius, height) {
  let wall = new CardEntity(null);
  wall.texture = createTextureFromColor(color);
  wall.mesh = createFromPlane(width, 3, (x, y) => {
    return addVec(
      new vec3(
        -Math.sin(x * 2 * Math.PI) * radius,
        y * height,
        Math.cos(x * 2 * Math.PI) * radius
      ),
      o
    );
  });
  return wall;
}

function createCardWithStick(
  entity,
  color = defaultPaperData.paperColor,
  height = 0.5,
  radius = 0.005
) {
  let stick = hackStickCardEntity(5, color, new vec3(), radius, height);
  entity.transform = transformMatMat(
    getTranslation(new vec3(0, height, -radius * 1.01)),
    entity.transform
  );
  stick.addChild(entity);
  return stick;
}
