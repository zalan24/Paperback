class CardEntity extends Entity {
  constructor(paperTexture, transform = new mat3x4()) {
    super(transform);
    this.vertex_buffer = gl.createBuffer();
    this.index_buffer = gl.createBuffer();
    this.paperTexture = paperTexture;
    this.mesh = null;
    this.occluder = true;
    if (paperTexture != null) {
      let t = this;
      usePaperTexture(paperTexture, function() {
        t.mesh = paperTexture.mesh;
        t.box = paperTexture.box;
        t.uploadIndices();
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
    if (this.ready == null) {
      // TODO
      updateVertexData(this.mesh, this.vertex_buffer);
      this.ready = true;
    }
    if (this.action != null && this.action.update != null)
      this.action.update(this, updateData);
  }

  uploadIndices() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    let indices = [];
    this.mesh.faces.forEach(f => {
      indices.push(f.a);
      indices.push(f.b);
      indices.push(f.c);
    });
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  }

  start() {
    if (this.action != null && this.action.start != null)
      this.action.start(this);
  }
}

function hackWallCardEntity(
  o,
  xDir,
  yDir,
  width = 30,
  height = 30,
  color = defaultPaperData.paperColor
) {
  let wall = new CardEntity(null);
  wall.texture = createTextureFromColor(color);
  wall.mesh = createFromPlane(width, height, (x, y) => {
    return {
      position: addVec(addVec(mulVecScalar(xDir, x), mulVecScalar(yDir, y)), o),
      normal: normalize(cross(xDir, yDir))
    };
  });
  // console.log(normalize(cross(xDir, yDir)));
  wall.uploadIndices();
  wall.occluder = false;
  return wall;
}

function hackStickCardEntity(width, color, o, radius, height) {
  let stick = new CardEntity(null);
  stick.texture = createTextureFromColor(color);
  stick.mesh = createFromPlane(width, 3, (x, y) => {
    return {
      position: addVec(
        new vec3(
          -Math.sin(x * 2 * Math.PI) * radius,
          y * height,
          Math.cos(x * 2 * Math.PI) * radius
        ),
        o
      ),
      normal: new vec3(
        -Math.sin(x * 2 * Math.PI) * radius,
        0,
        Math.cos(x * 2 * Math.PI) * radius
      )
    };
  });
  stick.uploadIndices();
  stick.occluder = false;
  return stick;
}

function createCardWithStick(
  entity,
  color = defaultPaperData.paperColor,
  height = 2,
  radius = 0.01
  // radius = 0.05
) {
  let stick = hackStickCardEntity(5, color, new vec3(), radius, height);
  stick.uploadIndices();
  entity.transform = transformMatMat(
    getTranslation(new vec3(0, height, -radius * 1.01)),
    entity.transform
  );
  stick.addChild(entity);
  stick.getCardPosition = function() {
    return transformMatPosition(entity.getTransform());
  };
  return stick;
}
