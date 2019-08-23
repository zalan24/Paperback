var glCanvas = document.getElementById("c");
var gl = glCanvas.getContext("webgl2", { antialias: false });

var shaderPrograms = {};

function createProgram(vertCode, fragCode) {
  let vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

let cardVertCode =
  "attribute vec3 position;" +
  "attribute vec2 texcoord;" +
  "uniform mat4 proj;" +
  "uniform mat4 view;" +
  "uniform mat4 model;" +
  "varying highp vec2 texc;" +
  "void main(void) {" +
  " vec4 pos = vec4(position, 1);" +
  " gl_Position = proj * view * model * pos;" +
  " texc = texcoord;" +
  "}";
var cardFragCode =
  "precision mediump float;" +
  "varying highp vec2 texc;" +
  "uniform sampler2D texture;" +
  "void main(void) {" +
  "  vec4 albedo = texture2D(texture, texc);" +
  "  if (albedo.a == 0.0) discard;" +
  "  gl_FragColor = albedo;" +
  "}";
shaderPrograms.cardProgram = {};
shaderPrograms.cardProgram.shader = createProgram(cardVertCode, cardFragCode);
shaderPrograms.cardProgram.vars = {
  position: gl.getAttribLocation(shaderPrograms.cardProgram.shader, "position"),
  texcoord: gl.getAttribLocation(shaderPrograms.cardProgram.shader, "texcoord"),
  texture: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "texture"),
  proj: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "proj"),
  view: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "view"),
  model: gl.getUniformLocation(shaderPrograms.cardProgram.shader, "model")
};

var projection = null;

var frameBuffers = {
  render: gl.createFramebuffer()
  // color: gl.createFramebuffer()
};
var colorRenderbuffer = gl.createRenderbuffer();
var frameSize = {};

function resize() {
  frameSize.w = glCanvas.width;
  frameSize.h = glCanvas.height;
  gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
  // console.log(gl.getParameter(gl.MAX_SAMPLES));
  gl.renderbufferStorageMultisample(
    gl.RENDERBUFFER,
    gl.getParameter(gl.MAX_SAMPLES),
    gl.RGBA8,
    glCanvas.width,
    glCanvas.height
  );
  // gl.renderbufferStorage(
  //   gl.RENDERBUFFER,
  //   gl.RGBA8,
  //   glCanvas.width,
  //   glCanvas.height
  // );
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers.render);
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.RENDERBUFFER,
    colorRenderbuffer
  );
  // gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers.color);
  // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

//TODO
resize();

function startRender() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers.render);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);

  projection = getProjection(40, glCanvas.width / glCanvas.height, 0.01, 100);
}

function endRender() {
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, frameBuffers.render);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  gl.clearBufferfv(gl.COLOR, 0, [1.0, 1.0, 1.0, 1.0]);
  gl.blitFramebuffer(
    0,
    0,
    frameSize.w,
    frameSize.h,
    0,
    0,
    glCanvas.width,
    glCanvas.height,
    gl.COLOR_BUFFER_BIT,
    gl.LINEAR
  );
}

function renderCard(renderData, cardData) {
  gl.useProgram(shaderPrograms.cardProgram.shader);
  let stride = 5 * 4;
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.position);
  gl.vertexAttribPointer(
    shaderPrograms.cardProgram.vars.position,
    3,
    gl.FLOAT,
    false,
    stride,
    0
  );
  gl.enableVertexAttribArray(shaderPrograms.cardProgram.vars.texcoord);
  gl.vertexAttribPointer(
    shaderPrograms.cardProgram.vars.texcoord,
    2,
    gl.FLOAT,
    false,
    stride,
    3 * 4
  );
  gl.uniformMatrix4fv(shaderPrograms.cardProgram.vars.proj, false, projection);
  gl.uniformMatrix4fv(
    shaderPrograms.cardProgram.vars.view,
    false,
    new Float32Array(renderData.view.getFloats())
  );
  gl.uniformMatrix4fv(
    shaderPrograms.cardProgram.vars.model,
    false,
    cardData.model.getFloats()
  );
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cardData.texture);
  gl.uniform1i(shaderPrograms.cardProgram.vars.texture, 0);
  gl.drawElements(gl.TRIANGLES, cardData.count, gl.UNSIGNED_SHORT, 0);
}

function updateVertexData(mesh, vertex_buffer, index_buffer) {
  let vertices = [];
  mesh.vertices.forEach(v => {
    vertices = vertices.concat([
      v.position.x,
      v.position.y,
      v.position.z,
      v.texcoord.x,
      v.texcoord.y
    ]);
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  let indices = [];
  mesh.faces.forEach(f => {
    indices.push(f.a);
    indices.push(f.b);
    indices.push(f.c);
  });
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
